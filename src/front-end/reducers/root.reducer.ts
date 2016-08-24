import { combineReducers } from 'redux';
import { routerReducer as angularRouterReducer} from 'ng2-redux-router';
import { routerReducer as reactRouterReducer } from 'react-router-redux';
import { routeBinding } from '../reducers/route-binding.reducer';
import { app, IAppState } from './app.reducer';
import { game, IGameState } from './game.reducer';
import { GameConfig } from '../../interfaces';
import { nextConfig } from './next-config.reducer';

export interface IState {
  app: IAppState;
  game: IGameState;
  nextConfig: GameConfig;
}

export const root = combineReducers<IState>({
  app,
  game,
  nextConfig,
  routing: routeBinding(combineReducers({
    angular: angularRouterReducer,
    react: reactRouterReducer,
  })),
});
