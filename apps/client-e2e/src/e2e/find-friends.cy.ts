import { FindFriends } from "../components/find-friends";
import { Login } from "../components/login";

describe('FindFriendPage', () => {

  const login = new Login();
  const findFriends = new FindFriends();

  beforeEach(()=>{
    login.visitPage();
    login.interceptAPI();
    login.loginForm();
  })

  it('should display title and h1', () => {
    login.waitForAPI();
    findFriends.visitPage();
    findFriends.title();
  });


});
