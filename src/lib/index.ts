// place files you want to import through the `$lib` alias in this folder.

function removeExtension(name: string) {
  return name.replace(/\.[^0-9]*$/, '');
}

export function parseAssetName(path: string) {
  const [name, version, platform, arch] = removeExtension(path).split('-');
  return {
    name,
    version,
    platform,
    arch,
  };
}