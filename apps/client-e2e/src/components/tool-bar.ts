import { getTag } from "../support/app.po";

export class ToolBar{
  companyTitle = "logo";
  chatSection = "chat";
  friendListSection = "friendList";
  findFriendSection = "findFriend";
  reloadButton = "reload";
  themeButton = "theme";
  notificationButton = "notification";
  profileMenu = "profileMenu";
  drawerMenu = "drawerMenu";
  editProfile = "editProfile";
  logout = "logout";
  loginButton = "login";
  registerButton = "register";

  clickLogo(){
    getTag('#' + this.companyTitle).click();
  }

  clickChat(){
    getTag('#' + this.chatSection).click();
  }

  clickFriendList(){
    getTag('#' + this.friendListSection).click();
  }

  clickFindFriend(){
    getTag('#' + this.findFriendSection).click();
  }

  clickReload(){
    getTag('#' + this.reloadButton).click();
  }

  clickTheme(){
    getTag('#' + this.themeButton).click();
  }

  clickNotification(){
    getTag('#' + this.notificationButton).click();
  }

  clickProfileMenu(){
    getTag('#' + this.profileMenu).click();
  }

  clickDrawerMenu(){
    getTag('#' + this.drawerMenu).click();
  }

  clickEditProfile(){
    getTag('#' + this.editProfile).click();
  }

  clickLogout(){
    getTag('#' + this.logout).click();
  }

  clickLogin(){
    getTag('#' + this.loginButton).click({force:true});
  }

  clickRegister(){
    getTag('#' + this.registerButton).click();
  }

}
