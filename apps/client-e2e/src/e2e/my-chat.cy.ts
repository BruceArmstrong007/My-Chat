import { Chats } from "../components/chats";
import { Login } from "../components/login";

describe('ChatsPage', () => {

  const login = new Login();
  const chats = new Chats();

  beforeEach(()=>{
    login.visitPage();
    login.interceptAPI();
    login.login();
  })

  it('should display title and h1', () => {
    login.interceptAPI();
    chats.title();
  });


});
