import { get } from "../support/app.po";

export class Header{
  companyTitle = "logo";
  chatSection = "chat";
  friendListSection = "friendList";
  findFriendSection = "findFriend";
  reloadButton = "reload";
  themeButton = "theme";
  notificationButton = "notification";
  profileMenu = "profileMenu";
  drawerMenu = "drawerMenu";

  clickLogo(){
    get('#' + this.companyTitle).click();
  }

  clickChat(){
    get('#' + this.chatSection).click();
  }

  clickFriendList(){
    get('#' + this.friendListSection).click();
  }

  clickFindFriend(){
    get('#' + this.findFriendSection).click();
  }

  clickReload(){
    get('#' + this.reloadButton).click();
  }

  clickTheme(){
    get('#' + this.themeButton).click();
  }

  clickNotification(){
    get('#' + this.notificationButton).click();
  }

  clickProfileMenu(){
    get('#' + this.profileMenu).click();
  }

  clickDrawerMenu(){
    get('#' + this.drawerMenu).click();
  }

}
