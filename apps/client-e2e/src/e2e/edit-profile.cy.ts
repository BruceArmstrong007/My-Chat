import { Login } from "../components/login";
import { Profile } from "../components/profile";
import { ToolBar } from "../components/tool-bar";

describe('EditProfile', () => {

  const login = new Login();
  const toolBar = new ToolBar();
  const profile = new Profile();


  beforeEach(()=>{
    login.interceptAPI();
    login.visitPage();
    login.loginForm();
    login.waitForAPI();
    toolBar.clickProfileMenu();
    toolBar.clickEditProfile();
  })

  it('should able to edit profile', () => {
    profile.interceptAPI();
    profile.profileForm();
    profile.waitForAPI();
  });


});
