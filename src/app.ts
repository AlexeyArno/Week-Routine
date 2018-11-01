import CreateView from './view/view'
import {TEST} from './test'

import {CashLocalStorage} from './cash'
import { DataBase } from './database';
import { Storage } from './storage';
import { Core } from './core';
import {OS} from './os'


// TEST()
// let database = ;
let core = new Core(
	new Storage(new DataBase()),
	new CashLocalStorage()
);
let UI = CreateView(core)

