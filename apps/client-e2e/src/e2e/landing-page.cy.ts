import { LandingPage } from "../components/landing-page";

describe('LandingPage', () => {

  const landingPage = new LandingPage();

  beforeEach(() => landingPage.visitPage());

  it('should display title and h1', () => {
    landingPage.checkTitle();
  });

});
