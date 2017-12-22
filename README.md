# Space Invasion the browser multiplayer MMORTS-shooter game

[![Build Status](http://img.shields.io/travis/Nikita-Boyarskikh/SpaceInvasionFrontend.svg?style=flat-square)](https://travis-ci.org/Nikita-Boyarskikh/SpaceInvasionFrontend)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e9f4c132945c27002140/test_coverage)](https://codeclimate.com/github/Nikita-Boyarskikh/SpaceInvasionFrontend/test_coverage)
[![Coverage Status](https://coveralls.io/repos/github/Nikita-Boyarskikh/SpaceInvasionFrontend/badge.svg?branch=master)](https://coveralls.io/github/Nikita-Boyarskikh/SpaceInvasionFrontend?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/e9f4c132945c27002140/maintainability)](https://codeclimate.com/github/Nikita-Boyarskikh/SpaceInvasionFrontend/maintainability)
[![Github Issues](http://githubbadges.herokuapp.com/Nikita-Boyarskikh/SpaceInvasionFrontend/issues.svg?style=flat-square)](https://github.com/Nikita-Boyarskikh/SpaceInvasionFrontend/issues)
[![Pending Pull-Requests](http://githubbadges.herokuapp.com/Nikita-Boyarskikh/SpaceInvasionFrontend/pulls.svg?style=flat-square)](https://github.com/Nikita-Boyarskikh/SpaceInvasionFrontend/pulls)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

# [SpaceInvasion](http://space-invasion-frontend.herokuapp.com)

## Table of contents

- [Story](#story)
- [Quick start](#quick-start)
- [What's included](#whats-included)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Mentor](#mentor)
- [Creators](#creators)
    - [Frontend](#frontend)
    - [Backend](#backend)
- [Copyright and license](#copyright-and-license)

![SpaceInvasion](https://github.com/Nikita-Boyarskikh/SpaceInvasionFrontend/raw/master/public/images/mainPage.jpg)

## Story

It is the browser game in the genre MMORTS shooter game "Space Invasion".
The moon is inhabited by two warring races: Humans and Aliens.
In this game you have to choose a side and fight for the right to live in this world.
Only one will survive. Capture the enemy base or your race will be defeated...

## Quick start

```
git clone git@github.com:Nikita-Boyarskikh/SpaceInvasionFrontend.git
cd SpaceInvasionFrontend
npm install
npm test && npm start
```

## What's included

```
SpaceInvasionFrontend
├── LICENSE
├── README.md
├── declarations.d.ts
├── deploy
│   ├── Dockerfile
│   ├── bin
│   │   ├── deploy.sh
│   │   └── gen_nginx_config
│   ├── conf
│   │   ├── config.ini
│   │   ├── nginx.conf
│   │   └── proxy_params
│   ├── crontab
│   └── deploy_rsa.enc
├── hooks
│   └── pre-commit
├── mocks
│   ├── emptyProcessor.js
│   ├── init.js
│   └── pugProcessor.js
├── package.json
├── public
│   ├── ServiceWorker.ts
│   ├── blocks
│   │   ├── about
│   │   │   ├── about.pug
│   │   │   └── index.ts
│   │   ├── block
│   │   │   └── index.ts
│   │   ├── form
│   │   │   └── index.ts
│   │   ├── game
│   │   │   ├── game.pug
│   │   │   ├── index.ts
│   │   │   ├── multiPlayerGameBlock.ts
│   │   │   └── singlePlayerGameBlock.ts
│   │   ├── home
│   │   │   ├── homepage.pug
│   │   │   └── index.ts
│   │   ├── leaderboard
│   │   │   ├── index.ts
│   │   │   ├── leaderboard.pug
│   │   │   └── pagination.pug
│   │   ├── login
│   │   │   ├── index.ts
│   │   │   └── login.pug
│   │   ├── notFound
│   │   │   ├── 404.pug
│   │   │   └── index.ts
│   │   ├── playerPage
│   │   │   ├── index.ts
│   │   │   └── playerPage.pug
│   │   ├── registration
│   │   │   ├── index.ts
│   │   │   └── registration.pug
│   │   └── winlose
│   │       ├── index.ts
│   │       └── winlose.pug
│   ├── css
│   │   ├── alien.css
│   │   ├── main.css
│   │   ├── man.css
│   │   └── mobile.css
│   ├── images
│   │   ├── background.jpg
│   │   ├── background2.jpg
│   │   ├── cartoon-moon.png
│   │   ├── cartoon-moon_blue.png
│   │   ├── cartoon-moon_green.png
│   │   ├── cartoon-moon_red.png
│   │   ├── egor_kurakov.jpg
│   │   ├── game
│   │   │   ├── alienUnitLeft.png
│   │   │   ├── alienUnitRight.png
│   │   │   ├── base.png
│   │   │   ├── bomb.png
│   │   │   ├── bombMushroom.png
│   │   │   ├── bullet.png
│   │   │   ├── coin.png
│   │   │   ├── defeat.png
│   │   │   ├── manUnitLeft.png
│   │   │   ├── manUnitRight.png
│   │   │   ├── moonBackground.png
│   │   │   ├── tower.png
│   │   │   └── victory.png
│   │   ├── mainPage.jpg
│   │   ├── moonBackground.png
│   │   ├── moonBackground_1440x824.png
│   │   ├── nikita_boyarskikh.jpg
│   │   ├── none.png
│   │   ├── olga_surikova.jpg
│   │   ├── shoot.png
│   │   ├── stop_404.png
│   │   ├── tower_round.svg
│   │   └── vasiliy_dmitriev.jpg
│   ├── index.htm
│   ├── index.ts
│   ├── locales
│   │   ├── en-US.ftl
│   │   └── ru-RU.ftl
│   ├── main.ts
│   ├── models
│   │   ├── game
│   │   │   ├── coords.ts
│   │   │   ├── gameScene.ts
│   │   │   ├── interfaces
│   │   │   │   ├── collidable.ts
│   │   │   │   ├── destructible.ts
│   │   │   │   ├── movable.ts
│   │   │   │   ├── oriented.ts
│   │   │   │   ├── rect.ts
│   │   │   │   ├── shootable.ts
│   │   │   │   └── temporary.ts
│   │   │   ├── mixins
│   │   │   │   ├── movableMixin.ts
│   │   │   │   └── subscriptableMixin.ts
│   │   │   ├── player.ts
│   │   │   ├── sprites
│   │   │   │   ├── base.ts
│   │   │   │   ├── bomb.ts
│   │   │   │   ├── bot.ts
│   │   │   │   ├── bullet.ts
│   │   │   │   ├── coin.ts
│   │   │   │   ├── mushroom.ts
│   │   │   │   ├── sprite.ts
│   │   │   │   ├── tower.ts
│   │   │   │   └── unit.ts
│   │   │   └── state.ts
│   │   ├── game.ts
│   │   └── user.ts
│   ├── modules
│   │   ├── emitter.ts
│   │   ├── game
│   │   │   ├── controllers
│   │   │   │   ├── controllerInterface.ts
│   │   │   │   ├── joystick.ts
│   │   │   │   ├── keyboardController.ts
│   │   │   │   └── mouseController.ts
│   │   │   └── strateges
│   │   │       ├── multiPlayerStrategy.ts
│   │   │       ├── singlePlayerStrategy.ts
│   │   │       ├── strategy.ts
│   │   │       └── strategyInterface.ts
│   │   ├── http.ts
│   │   ├── navigator.ts
│   │   ├── router.ts
│   │   └── themes.ts
│   ├── services
│   │   ├── collisionService.ts
│   │   ├── gameService.ts
│   │   ├── userService.ts
│   │   └── webSockets.ts
│   ├── templates
│   │   ├── chooserace.pug
│   │   └── navbar.pug
│   └── utils
│       ├── aboutAlertDialog.ts
│       ├── constants.ts
│       ├── font.ts
│       ├── imageResizer.ts
│       ├── localisation.ts
│       ├── notifications.ts
│       ├── utils.ts
│       └── validationRules.ts
├── tests
│   └── unit
│       ├── simple.test.ts
│       ├── user.test.ts
│       ├── userService.test.ts
│       └── utils.test.ts
├── tsconfig.json
├── tslint.json
└── webpack.config.js
```

## Bugs and feature requests

Have a bug or a feature request? Please first read the [issue guidelines](https://github.com/Nikita-Boyarskikh/SpaceInvasionFrontend/blob/master/CONTRIBUTING.md#using-the-issue-tracker) and search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/Nikita-Boyarskikh/SpaceInvasionFrontend/issues/new).


## Documentation

[Wiki](https://github.com/java-park-mail-ru/SpaceInvasion-09-2017/wiki)

## Contributing

Please read through our [contributing guidelines](https://github.com/java-park-mail-ru/SpaceInvasion-09-2017/blob/master/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.


## Mentor

**Egor Utrobin**

- <https://t.me/utrobin>
- <https://github.com/utrobin>


## Creators

### Fullstack

**Boyarskikh Nikita**

- <https://t.me/Nikita_Boyarskikh>
- <https://github.com/Nikita-Boyarskikh>

# Backend

**Egor Kurakov**

- <https://t.me/Egor_Kurakov>
- <https://github.com/KurakovEgor>

### Frontend

**Olga Surikova**

- <https://t.me/ChocolateSwan>
- <https://github.com/ChocolateSwan>

**Vasiliy Dmitriev**

- <https://t.me/vasidmi>
- <https://github.com/devasidmi>


## Copyright and license

Code released under the [MIT License](LICENSE).
