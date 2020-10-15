import * as React from 'react';
import { Action, History, Location, LocationState } from 'history';
import { Middleware, Store } from 'redux';

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

export interface LocationChangeAction<S = LocationState> {
  type: typeof LOCATION_CHANGE;
  payload: LocationChangePayload<S>;
}

export type LocationChangePayload<S = LocationState> = RouterState<S>;

export type Methods = 'go' | 'goBack' | 'goForward' | 'push' | 'replace';

export interface RouterAction {
  type: string;
  payload: {
    method: Methods;
    args: any[];
  };
}

export interface RouterLocation<S> extends Location<S> {
  query: Record<string, string>;
}

export type RouterMiddleware = <S = LocationState>(history: History<S>) => Middleware;

export interface RouterRootState<S = LocationState> {
  router: RouterState<S>;
}

export interface RouterState<S = LocationState> {
  location: RouterLocation<S>;
  action: Action;
}

export interface ConnectedRouterProps<S = LocationState> {
  children: React.FunctionComponent | React.ReactNode;
  history: History<S>;
  onLocationChanged: (location: Location<S>, action: Action) => LocationChangeAction<S>;
  store: Store;
}
