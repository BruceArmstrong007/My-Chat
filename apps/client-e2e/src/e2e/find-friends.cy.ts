import { FindFriends } from "../components/find-friends";
import { Login } from "../components/login";

describe('FindFriendPage', () => {

  const login = new Login();
  const findFriends = new FindFriends();

  beforeEach(()=>{
    login.interceptAPI();
    login.visitPage();
    login.loginForm();
    login.waitForAPI();
    findFriends.visitPage();
  })

  it('should display title and h1', () => {
    findFriends.checkTitle();
  });


});
