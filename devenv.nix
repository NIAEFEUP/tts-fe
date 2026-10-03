{ pkgs, ... }:

{
  languages.javascript = {
    enable = true;
    # Matches the node version used by apps/frontend/Dockerfile.
    package = pkgs.nodejs_22;
    bun.enable = true;
    corepack.enable = true;
  };
}
