import { getTag } from "../support/app.po";

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

}
