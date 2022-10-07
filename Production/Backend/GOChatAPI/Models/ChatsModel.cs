using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GOChatAPI.Models
{
    public class ChatsModel
    {
        public string ChatID { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public string Type { get; set; }
        public Parent Parent { get; set; }
        public Author Author { get; set; }
        public List<ChatFile> ChatFile { get; set; }
        public string ChatroomID { get; set; }
    }

    public class Parent
    {
        public string ParentID { get; set; }
        public string ParentAuthor { get; set; }
        public string ParentMessage { get; set; }
    }

    public class ChatFile
    {
        public string FileName { get; set; }
        public string Path { get; set; }
        public float Size { get; set; }
    }

    public class Author
    {
        public string AuthorID { get; set; }
        public string AuthorName { get; set; }
        public string AuthorImage { get; set; }
    }
}
