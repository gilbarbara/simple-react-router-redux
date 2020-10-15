import * as ReactRouterRedux from '../src';

describe('simple-react-router-redux', () => {
  it('should have all exports', () => {
    expect(ReactRouterRedux).toMatchSnapshot();
  });
});
