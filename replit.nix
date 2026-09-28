# Replit-native environment. Local Docker dev ignores this file —
# the Dockerfiles own the local runtimes. Replit uses Nix instead.
# Keep versions aligned with docker/frontend.Dockerfile (node:20)
# and docker/backend.Dockerfile (python:3.12).

{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.python312
    pkgs.python312Packages.pip
  ];
}
