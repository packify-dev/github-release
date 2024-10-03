import { json } from '@sveltejs/kit';
import { Octokit } from '@octokit/rest';
import { parseAssetName } from '$src/lib/index.js';

type Asset = {
	url: string;
	size: number;
};

export async function GET({ params }) {
	const octokit = new Octokit();

	const latest = params.version === 'latest' || params.version === 'dev';

	let data;

	if (latest) {const includePrerelease = params.version === 'dev' ? true : false;

	
	if (includePrerelease) {
		try {
			data = await octokit.repos
				.listReleases({
					owner: params.user,
					repo: params.repo?.replaceAll('~', params.user) ?? params.user,
					per_page: 1
				})
				.then((res) => res.data);
		} catch {
			return json(
				{
					error: 'not_found'
				},
				{ headers: { 'Access-Control-Allow-Origin': '*' }, status: 404 }
			);
		}

		if (data?.length === 0) {
			return json(
				{
					error: 'not_found'
				},
				{ headers: { 'Access-Control-Allow-Origin': '*' }, status: 404 }
			);
		}

		data = data[0];
	} else {
		try {
			data = await octokit.repos
				.getLatestRelease({
					owner: params.user,
					repo: params.repo?.replaceAll('~', params.user) ?? params.user
				})
				.then((res) => res.data);
		} catch {
			return json(
				{
					error: 'not_found'
				},
				{ headers: { 'Access-Control-Allow-Origin': '*' }, status: 404 }
			);
		}
	}} else {
		try {
			data = await octokit.repos
				.getReleaseByTag({
					owner: params.user,
					repo: params.repo?.replaceAll('~', params.user) ?? params.user,
					tag: params.version
				})
				.then((res) => res.data);
		} catch {
			return json(
				{
					error: 'not_found'
				},
				{ headers: { 'Access-Control-Allow-Origin': '*' }, status: 404 }
			);
		}
	};

	const binaries: Record<string, Record<string, Asset>> = {};

	const assets: Record<string, Asset> = {};

	const [ platform, arch ] = params.meta.split('/');
  
  data.assets.forEach((asset) => {
		const type = parseAssetName(asset.name);
		if (type.platform) {
			binaries[type.platform] = binaries[type.platform] || {};
			binaries[type.platform][type.arch] = {
				url: asset.browser_download_url,
				size: asset.size
			};
		}
		assets[asset.name] = {
			url: asset.browser_download_url,
			size: asset.size
		};
	});

  if (!arch) {
    if (!assets[platform]) {
      return json(
        {
          error: 'not_found'
        },
        { headers: { 'Access-Control-Allow-Origin': '*' }, status: 404 }
      );
    }

    return json(
      {
        url: assets[platform].url,
        size: assets[platform].size
      },
      { headers: { 'Access-Control-Allow-Origin': '*', 'Location': assets[platform].url }, status: 302 }
    );
  }

  if (!binaries[platform]?.[arch]) {
    return json(
      {
        error: 'not_found'
      },
      { headers: { 'Access-Control-Allow-Origin': '*' }, status: 404 }
    );
  }

  return json(
    {
      url: binaries[platform][arch].url,
      size: binaries[platform][arch].size
    },
    { headers: { 'Access-Control-Allow-Origin': '*', 'Location': binaries[platform][arch].url }, status: 302 }
  );
}
