using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GOChatAPI.Models
{
    public class ChatRoomModel
    {
        public string ChatRoomID { get; set; }
        public string ChatRoomName { get; set; }
        public string ProfilePicture { get; set; }
        public string Type { get; set; }
        public bool IsOnline { get; set; }
        public string Description { get; set; }
        public DateTime LastSeen { get; set; }
        public List<UserModel> Members { get; set; }
        public List<ChatsModel> Chats { get; set; }
    }
}