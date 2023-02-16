import { Chats } from "../components/chats";
import { Login } from "../components/login";

describe('ChatsPage', () => {

  const login = new Login();
  const chats = new Chats();

  beforeEach(()=>{
    login.interceptAPI();
    login.visitPage();
    login.loginForm();
  })

  it('should display title and h1', () => {
    login.waitForAPI();
    chats.visitPage();
    chats.checkTitle();
  });


});
