import { ListViewPage } from './app.po';

describe('list-view App', () => {
  let page: ListViewPage;

  beforeEach(() => {
    page = new ListViewPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
