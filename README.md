# GitHub Release API

URL scheme: `https://ghr.packify.dev/<owner>/[repo]/<tag>/[action]`

- `owner`: GitHub username or organization name
- `repo`: GitHub repository name (optional, defaults to the value of `owner`). Tilde `~` can be used to refer to the owner name.
- `tag`: GitHub release tag or `latest` for the latest release, or `dev` for the latest pre-release
- `action`: Currently only `download` is supported. Leave empty to get the release information.

**Examples:**

- `https://ghr.packify.dev/rclone/latest` (rclone/rclone, latest)
- `https://ghr.packify.dev/rclone/v1.68.2` (rclone/rclone, v1.68.2)
- `https://ghr.packify.dev/rclone/rclone-js-api/latest` (rclone/rclone-js-api, latest)
- `https://ghr.packify.dev/rclone/~-js-api/latest` (rclone/rclone-js-api, latest)

## Downloading release assets

### Platform-specific download

To download a platform-specific release asset, use the following URL scheme:

`https://ghr.packify.dev/<owner>/[repo]/<tag>/download/<platform>/<arch>/[ext]`

- `platform`: The target platform of the release asset. Examples: `linux`, `windows`, `macos`
- `arch`: The target architecture of the release asset. Examples: `amd64`, `arm64`
- `ext`: The file extension of the release asset. (optional) Examples: `tar.gz`, `zip`, `deb`, `rpm`, `exe`

**Examples:**

- `https://ghr.packify.dev/rclone/latest/download/linux/amd64` (rclone/rclone, latest release, download linux/amd64 binaries)
- `https://ghr.packify.dev/rclone/latest/download/linux/amd64/deb` (rclone/rclone, latest release, download linux/amd64 deb package)

#### File naming scheme

To ensure your asset name gets parsed correctly, please follow the naming scheme below:

`<name>.<ext>` or `<name>-<tag>-<platform>-<arch>.<ext>`

- `name`: The name of the release asset. This is the name of the file as it appears on the GitHub release page.
- `tag`: The release tag of the release asset. This is the tag of the release as it appears on the GitHub release page.
- `platform`: The target platform of the release asset. Examples: `linux`, `windows`, `macos`
- `arch`: The target architecture of the release asset. Examples: `amd64`, `arm64`
- `ext`: The file extension of the release asset. Examples: `tar.gz`, `zip`, `deb`, `rpm`, `exe`

### Downloading a specific release asset

To download a specific release asset, use the following URL scheme:

`https://ghr.packify.dev/<owner>/[repo]/<tag>/download/<asset-name>`

- `asset-name`: The name of the release asset to download. This is the name of the file as it appears on the GitHub release page.

**Examples:**

- `https://ghr.packify.dev/rclone/dev/download/version.txt` (rclone/rclone, latest pre-release, download version.txt)
- `https://ghr.packify.dev/rclone/v1.68.2/download/rclone-v1.68.2-linux-amd64.zip` (rclone/rclone, v1.68.2, download rclone-v1.68.2-linux-amd64.zip)