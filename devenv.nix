{ pkgs, ... }:

{
  languages.javascript = {
    enable = true;
    # Node version used for local tooling (the Docker images run on Bun).
    package = pkgs.nodejs_22;
    bun.enable = true;
    corepack.enable = true;
  };
}
