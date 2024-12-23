// place files you want to import through the `$lib` alias in this folder.

function removeExtension(name: string) {
  return name.replace(/\.[^0-9]*$/, '');
}

export function parseAssetName(path: string) {
  const noExt = removeExtension(path);
  const [name, version, platform, arch] = noExt.split('-');
  return {
    name,
    ext: path.replace(noExt + '.', ''),
    version,
    platform,
    arch,
  };
}