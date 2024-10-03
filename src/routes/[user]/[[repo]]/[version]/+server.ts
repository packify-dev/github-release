import { json } from '@sveltejs/kit';
import { Octokit } from '@octokit/rest';
import { SemVer } from 'semver';
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

	const version = (() => {
		try {
			return new SemVer(data.tag_name);
		} catch {
			return new SemVer('0.0.0');
		}
	})();

	const binaries: Record<string, Record<string, Asset>> = {};

	const assets: Record<string, Asset> = {};

	data.assets.forEach((asset) => {
		const type = parseAssetName(asset.name);
		if (type.platform) {
			binaries[type.platform] = binaries[type.platform] || {};
			binaries[type.platform][type.arch] = {
				url: asset.browser_download_url,
				size: asset.size
			};
			return;
		}
		assets[asset.name] = {
			url: asset.browser_download_url,
			size: asset.size
		};
	});

	return json(
		{
			error: null,
			name: data.name,
			id: data.id,
			tag: data.tag_name,
			version,
			assets,
			binaries,
			prerelease: data.prerelease
		},
		{ headers: { 'Access-Control-Allow-Origin': '*' } }
	);
}
