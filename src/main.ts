﻿/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
import '../font-awesome.min.css';
import './styles/app.scss';
import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import state from './store/state';

export async function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging();

    aurelia.use.feature(PLATFORM.moduleName('resources/index'));

    aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-store'), { initialState: state });

    await aurelia.start();
    await aurelia.setRoot(PLATFORM.moduleName('app'));
}
