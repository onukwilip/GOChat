using GOChatAPI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.IO;
using System.Data;

namespace GOChatAPI.Controllers
{
    /// <summary>
    /// Defines all API endoints concerning chats in a chatroom
    /// </summary>
    [RoutePrefix("api/chats")]
    public class ChatsController : ApiController
    {
        SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["GOChat"].ConnectionString);
        General general = new General();

        // GET: api/Chats
        /// <summary>
        /// Get's the chats pertaining to a particular chatroom
        /// </summary>
        /// <param name="Base64ChatRoomID">Chatroom id in base 64 format</param>
        /// <returns></returns>
        [Route("{Base64ChatRoomID}")]
        public List<ChatsModel> GetChatRoomChats(string Base64ChatRoomID)
        {
            List<ChatsModel> chats = new List<ChatsModel>();

            var ChatroomByteCode = Convert.FromBase64String(Base64ChatRoomID);
            string ChatRoomID = Encoding.UTF8.GetString(ChatroomByteCode);

            //GET ALL CHATS IN THE CHATROOM
            SqlCommand cmdChats = new SqlCommand("GetChatRoomChats", con);
            cmdChats.CommandType = CommandType.StoredProcedure;
            cmdChats.Parameters.Clear();
            cmdChats.Parameters.AddWithValue("@ChatRoomID", ChatRoomID);
            SqlDataAdapter sdaChats = new SqlDataAdapter(cmdChats);
            DataTable dtChats = new DataTable();
            sdaChats.Fill(dtChats);

           /* //GET PARENT CHAT AUTHOR NAME
            SqlCommand cmdChatParent = new SqlCommand("GetChatAuthorName", con); //SELECT u.UserName FROM Chats ch INNER JOIN Users u on ch.AuthorID = u.UserID and ch.ChatID=@ChatID
            cmdChatParent.CommandType = CommandType.StoredProcedure; */

          /*  //GET EACH CHAT FILES
            SqlCommand cmdChatFile = new SqlCommand("GetChatFile", con);
            cmdChatFile.CommandType = CommandType.StoredProcedure; */

            //GET ALL CHATS FROM DATABASE AND MAP INTO CHAT ARRAY 
            for (int j = 0; j < dtChats.Rows.Count; j++)
            {
                Parent parent = new Parent();
                List<ChatFile> files = new List<ChatFile>();
                Author author = new Author();
                string authorBytes = dtChats.Rows[j]["AuthorImage"].ToString(), authorImage = String.Empty, chatID = dtChats.Rows[j]["ChatID"].ToString(), parentID= dtChats.Rows[j]["ParentID"].ToString();

                if (authorBytes != null && authorBytes != "")
                {
                    var base64 = Convert.ToBase64String((byte[])dtChats.Rows[j]["AuthorImage"]);
                    authorImage = String.Format("data:image/png;base64, {0}", base64);
                }

                //GET PARENT CHAT AUTHOR NAME
                SqlCommand cmdChatParent = new SqlCommand("GetChatAuthorName", con); //SELECT u.UserName FROM Chats ch INNER JOIN Users u on ch.AuthorID = u.UserID and ch.ChatID=@ChatID
                cmdChatParent.CommandType = CommandType.StoredProcedure;

                //GET THE NAME OF THE PARENT CHAT AUTHOR
                cmdChatParent.Parameters.Clear();
                cmdChatParent.Parameters.AddWithValue("@ChatID", parentID);
                SqlDataAdapter sdaChatParent = new SqlDataAdapter(cmdChatParent);
                DataTable dtChatParent = new DataTable();
                sdaChatParent.Fill(dtChatParent);

                int chatParentCount = dtChatParent.Rows.Count;

                if (chatParentCount > 0)
                {
                    parent.ParentAuthor = dtChatParent.Rows[0]["UserName"].ToString();
                }

                //GET EACH CHAT FILES
                SqlCommand cmdChatFile = new SqlCommand("GetChatFile", con);
                cmdChatFile.CommandType = CommandType.StoredProcedure;

                //GET ALL FILES RELATED TO THIS CHAT
                cmdChatFile.Parameters.Clear();
                cmdChatFile.Parameters.AddWithValue("@ChatID", chatID);
                SqlDataAdapter sdaChatFile = new SqlDataAdapter(cmdChatFile);
                DataTable dtChatFile = new DataTable();
                sdaChatFile.Fill(dtChatFile);

                int chatFileCount = dtChatFile.Rows.Count;

                if (chatFileCount > 0)
                {
                    for (int cf = 0; cf < chatFileCount; cf++)
                    {
                        string fileBytes = dtChatFile.Rows[cf]["FilePath"].ToString(), filePath = String.Empty;

                        if (fileBytes != null && fileBytes != "")
                        {
                            var base64 = Convert.ToBase64String((byte[])dtChatFile.Rows[cf]["FilePath"]);
                            filePath = String.Format("data:image/png;base64, {0}", base64);
                        }

                        ChatFile file = new ChatFile();
                        file.FileName = dtChatFile.Rows[cf]["FileName"].ToString();
                        file.Size = (int)dtChatFile.Rows[cf]["FileSize"];
                        file.Path = filePath;

                        files.Add(file);
                    }
                }

                ChatsModel chat = new ChatsModel();
                chat.ChatID = dtChats.Rows[j]["ChatID"].ToString();
                chat.Message = dtChats.Rows[j]["ChatMessage"].ToString();
                chat.ChatroomID = dtChats.Rows[j]["ChatRoomID"].ToString();
                chat.Type = dtChats.Rows[j]["ChatType"].ToString();
                chat.Date = Convert.ToDateTime(dtChats.Rows[j]["DateSent"]);

                parent.ParentID = dtChats.Rows[j]["ParentID"].ToString();
                parent.ParentMessage = dtChats.Rows[j]["ParentMessage"].ToString();

                author.AuthorID = dtChats.Rows[j]["AuthorID"].ToString();
                author.AuthorName = dtChats.Rows[j]["AuthorName"].ToString();
                author.AuthorImage = authorImage; //authorImage;

                chat.Parent = parent;
                chat.Author = author;
                chat.ChatFile = files;

                chats.Add(chat);
            }

            return chats;
        }

        // GET: api/Chats/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Chats
        /// <summary>
        /// Posts a new chat from the chatroom into the database
        /// </summary>
        /// <param name="UserID">Id of the user that posted the chat</param>
        /// <param name="Base64IPAddress">Base 64 IP address of the user posting the chat</param>
        /// <param name="Base64ChatRoomID">Base 64 string of user's chatroom</param>
        /// <param name="Message">Message of the chat</param>
        /// <param name="AuthorID">ID of user sending the chat</param>
        /// <param name="ParentID">ID of chat to be replied</param>
        /// <param name="ChatType">The chat specification</param>
        ///<returns>Response object</returns>
        [HttpPost]
        [Route("{UserID}/{Base64IPAddress}/{Base64ChatRoomID}/{Message}/{AuthorID}/{ParentID}/{ChatType}")]
        public async Task<ResponseModel> Post(string UserID, string Base64IPAddress, string Base64ChatRoomID, string Message, string AuthorID, string ParentID, string ChatType)
        {
            ResponseModel response = new ResponseModel();
            bool res = false;

            var ByteCode = Convert.FromBase64String(Base64IPAddress);
            string IPAddress = Encoding.UTF8.GetString(ByteCode);

            var ChatRoomByteCode = Convert.FromBase64String(Base64ChatRoomID);
            string ChatRoomID = Encoding.UTF8.GetString(ChatRoomByteCode);

            string chatID = string.Concat("CHAT", "_", Guid.NewGuid(), "_", general.Encrypt(DateTime.Now.Ticks.ToString()));

            var ctx = HttpContext.Current;
            var root = ctx.Server.MapPath("~/App_Data");
            var provider = new MultipartFileStreamProvider(root);

            SqlCommand cmd = new SqlCommand("CreateChat", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", UserID);
            cmd.Parameters.AddWithValue("@IPAddress", IPAddress);
            cmd.Parameters.AddWithValue("@ChatID", chatID);
            cmd.Parameters.AddWithValue("@ChatRoomID", ChatRoomID);
            cmd.Parameters.AddWithValue("@ChatMessage", Message);
            cmd.Parameters.AddWithValue("@AuthorID", AuthorID);
            cmd.Parameters.AddWithValue("@ParentID", ParentID);
            cmd.Parameters.AddWithValue("@ChatType", ChatType);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();

            if (i > 0)
            {
                try
                {
                    await Request.Content.ReadAsMultipartAsync(provider);
                    foreach (var file in provider.FileData)
                    {
                        var name = file.Headers.ContentDisposition.FileName;
                        int size = (int)file.Headers.ContentDisposition.Size;
                        name = name.Trim('"');
                        var localFileName = file.LocalFileName;
                        res = SaveFile(localFileName, name, size, UserID, IPAddress, chatID, ChatRoomID);
                    }

                    if (res)
                    {
                        var success = ResponseCodes.Successfull;
                        response.ResponseCode = (int)success;
                        response.ResponseMessage = ResponseCodes.Successfull.ToString();
                    }

                    else
                    {
                        var fail = ResponseCodes.Unsuccessfull;
                        response.ResponseCode = (int)fail;
                        response.ResponseMessage = ResponseCodes.Unsuccessfull.ToString();
                    }
                }

                catch (Exception e)
                {
                    var fail = ResponseCodes.Unsuccessfull;
                    response.ResponseCode = (int)fail;
                    response.ResponseMessage = ResponseCodes.Unsuccessfull.ToString();
                }
            }
            else
            {
                var fail = ResponseCodes.Unsuccessfull;
                response.ResponseCode = (int)fail;
                response.ResponseMessage = ResponseCodes.Unsuccessfull.ToString();
            }

            return response;
        }

        // POST: api/Chats
        /// <summary>
        /// Posts a new chat from the chatroom into the database
        /// </summary>
        /// <param name="UserID">Id of the user that posted the chat</param>
        /// <param name="Base64IPAddress">Base 64 IP address of the user posting the chat</param>
        /// <param name="Base64ChatRoomID">Base 64 string of user's chatroom</param>
        /// <param name="ChatID">The ID of the chat the files are referring to</param>
        ///<returns>Response object</returns>
        [HttpPost]
        [Route("{UserID}/{Base64IPAddress}/{Base64ChatRoomID}/{ChatID}")]
        public async Task<ResponseModel> PostFile(string UserID, string Base64IPAddress, string Base64ChatRoomID, string ChatID)
        {
            ResponseModel response = new ResponseModel();
            bool res = false;

            var ByteCode = Convert.FromBase64String(Base64IPAddress);
            string IPAddress = Encoding.UTF8.GetString(ByteCode);

            var ChatRoomByteCode = Convert.FromBase64String(Base64ChatRoomID);
            string ChatRoomID = Encoding.UTF8.GetString(ChatRoomByteCode);

            var ctx = HttpContext.Current;
            var root = ctx.Server.MapPath("~/App_Data");
            var provider = new MultipartFileStreamProvider(root);

            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);
                foreach (var file in provider.FileData)
                {
                    var name = file.Headers.ContentDisposition.FileName;
                    int size = (int)new FileInfo(file.LocalFileName).Length;
                    name = name.Trim('"');
                    var localFileName = file.LocalFileName;
                    res = SaveFile(localFileName, name, size, UserID, IPAddress, ChatID, ChatRoomID);
                }

                if (res)
                {
                    var success = ResponseCodes.Successfull;
                    response.ResponseCode = (int)success;
                    response.ResponseMessage = ResponseCodes.Successfull.ToString();
                }

                else
                {
                    var fail = ResponseCodes.Unsuccessfull;
                    response.ResponseCode = (int)fail;
                    response.ResponseMessage = ResponseCodes.Unsuccessfull.ToString();
                }
            }

            catch (Exception e)
            {
                var fail = ResponseCodes.Unsuccessfull;
                response.ResponseCode = (int)fail;
                response.ResponseMessage = e.ToString();//ResponseCodes.Unsuccessfull.ToString();
            }


            return response;
        }

        // POST: api/Chats
        /// <summary>
        /// Posts a new chat from the chatroom into the database
        /// </summary>
        /// <param name="UserID">Id of the user that posted the chat</param>
        /// <param name="Base64IPAddress">Base 64 IP address of the user posting the chat</param>
        /// <param name="chats">Object in which the JSON body is being mapped into</param>
        ///<returns>Response object</returns>
        [HttpPost]
        [Route("{UserID}/{Base64IPAddress}")]
        public ResponseModel PostChat(string UserID, string Base64IPAddress, ChatsModel chats)
        {
            ResponseModel response = new ResponseModel();

            var ByteCode = Convert.FromBase64String(Base64IPAddress);
            string IPAddress = Encoding.UTF8.GetString(ByteCode);

            SqlCommand cmd = new SqlCommand("CreateChat", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", UserID);
            cmd.Parameters.AddWithValue("@IPAddress", IPAddress);
            cmd.Parameters.AddWithValue("@ChatID", chats.ChatID);
            cmd.Parameters.AddWithValue("@ChatRoomID", chats.ChatroomID);
            cmd.Parameters.AddWithValue("@ChatMessage", chats.Message);
            cmd.Parameters.AddWithValue("@AuthorID", chats.Author.AuthorID);
            cmd.Parameters.AddWithValue("@ParentID", chats.Parent.ParentID);
            cmd.Parameters.AddWithValue("@ChatType", chats.Type);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();

            if (i > 0)
            {
                var success = ResponseCodes.Successfull;
                response.ResponseCode = (int)success;
                response.ResponseMessage = ResponseCodes.Successfull.ToString();
            }
            else
            {
                var fail = ResponseCodes.Unsuccessfull;
                response.ResponseCode = (int)fail;
                response.ResponseMessage = ResponseCodes.Unsuccessfull.ToString();
            }

            return response;
        }

        public bool SaveFile(string localFile, string fileName, int fileSize, string UserID, string IPAddress, string chatID, string chatRoomID)
        {
            byte[] fileBytes;

            using (var fs = new FileStream(localFile, FileMode.Open, FileAccess.Read))
            {
                fileBytes = new byte[fs.Length];
                fs.Read(fileBytes, 0, Convert.ToInt32(fs.Length));
            }

            SqlCommand cmd = new SqlCommand("CreateChatFile", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", UserID);
            cmd.Parameters.AddWithValue("@IPAddress", IPAddress);
            cmd.Parameters.AddWithValue("@FilePath", fileBytes);
            cmd.Parameters.AddWithValue("@FileName", fileName);
            cmd.Parameters.AddWithValue("@FileSize", fileSize);
            cmd.Parameters.AddWithValue("@ChatID", chatID);
            cmd.Parameters.AddWithValue("@ChatRoomID", chatRoomID);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();

            if (i > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        // PUT: api/Chats/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Chats/5
        /// <summary>
        /// Delete's a specific chat pertaining a user frm the database
        /// </summary>
        /// <param name="ChatID">The ID of the chat to be deleted</param>
        /// <param name="UserID">The ID of the user sending this request</param>
        /// <param name="Base64IPAddress">The base 64 IP address of the user sending the request</param>
        [HttpDelete]
        [Route("{UserID}/{Base64IPAddress}/{ChatID}")]
        public ResponseModel Delete(string ChatID, string UserID, string Base64IPAddress)
        {
            ResponseModel response = new ResponseModel();

            var ByteCode = Convert.FromBase64String(Base64IPAddress);
            string IPAddress = Encoding.UTF8.GetString(ByteCode);

            SqlCommand cmd = new SqlCommand("DeleteChat", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", UserID);
            cmd.Parameters.AddWithValue("@IPAddress", IPAddress);
            cmd.Parameters.AddWithValue("@ChatID", ChatID);
           
            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();

            if (i > 0)
            {
                var success = ResponseCodes.Successfull;
                response.ResponseCode = (int)success;
                response.ResponseMessage = ResponseCodes.Successfull.ToString();
            }
            else
            {
                var fail = ResponseCodes.Unsuccessfull;
                response.ResponseCode = (int)fail;
                response.ResponseMessage = ResponseCodes.Unsuccessfull.ToString();
            }

            return response;
        }
    }
}
