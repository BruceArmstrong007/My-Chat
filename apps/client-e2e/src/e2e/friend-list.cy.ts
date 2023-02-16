import { FriendList } from "../components/friend-list";
import { Login } from "../components/login";

describe('FriendListPage', () => {

  const login = new Login();
  const friendList = new FriendList();


  beforeEach(()=>{
    login.interceptAPI();
    login.visitPage();
    login.loginForm();
    login.waitForAPI();
    friendList.visitPage();
  })

  it('should display title and h1', () => {
    friendList.checkTitle();
  });


});
