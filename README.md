# rpg-cards
>**NOTE:** This repository is a fork. All custom changes are done on `kyma-master` branch.

RPG spell/item/monster card generator

## Preview
Click [here](https://demonsthere.github.io/rpg-cards/generator/generate.html) for a live preview of this generator.

## FAQ
- What browsers are supported?
  - A modern browser (Chrome, Firefox, Edge, Safari). The generator has some issues on IE.
- Cards are generated without icons and background colors, what's wrong?
  - Enable printing backround images in your browser print dialog
- I can't find an icon that I've seen on [game-icons.net](http://game-icons.net), where is it?
  - See the section "updating icons" below.
- The layout of the cards is broken (e.g., cards are placed outside the page), what's wrong?
  - Check your page size, card size, and cards/page settings. If you ask the generator to place 4x4 poker-sized cards on a A4 paper, they won't fit and they will overflow the page.

## Local development
This project has been dockerized, and can be run by using `docker-compose`. Currently the compose file has 2 containers defined:
- web, for running the web service
- dev, a "devbox" instance with node, that can be used to update icons live
I plan on changing the model to multi-stage dockerfile, or load the icons from an external volume in the future. 

## License

This generator is provided under the terms of the MIT License

Icons are made by various artists, available at [http://game-icons.net](http://game-icons.net).
They are provided under the terms of the Creative Commons 3.0 BY license.
