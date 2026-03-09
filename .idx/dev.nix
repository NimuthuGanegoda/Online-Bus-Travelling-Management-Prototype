# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.cmake
    pkgs.flutter
    pkgs.sudo
    pkgs.ninja
    pkgs.gcc
    pkgs.clang
    pkgs.pkg-config
    pkgs.gtk3
  ];
  idx = {
    previews.enable = true;
  };
}
