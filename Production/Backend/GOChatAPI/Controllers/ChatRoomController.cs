using GOChatAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace GOChatAPI.Controllers
{
    /// <summary>
    /// Handles all API's and routes concerning chatrooms
    /// </summary>
    [RoutePrefix("api/chatroom")]
    public class ChatRoomController : ApiController
    {
        SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["GOChat"].ConnectionString);
        General general = new General();
        /// <summary>
        /// Gets all chatRooms of type group in the database
        /// </summary>
        /// <returns>Response object</returns>
        [Route("")]
        [HttpGet]
        public ResponseModel GetChatRoomS_Group()
        {
            ResponseModel response = new ResponseModel();
            List<object> chatRooms = new List<object>();

            SqlCommand cmd = new SqlCommand("GetChatRoom_Group", con);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter sda = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sda.Fill(dt);

            int i = dt.Rows.Count;

            if (i>0)
            {
                for (int j = 0;  j < i;  j++)
                {
                    ChatRoomModel chatRoom = new ChatRoomModel();

                    chatRoom.ChatRoomID = dt.Rows[j]["ChatRoomID"].ToString();
                    chatRoom.ChatRoomName = dt.Rows[j]["ChatRoomName"].ToString();
                    chatRoom.ProfilePicture = dt.Rows[j]["ChatRoomPicture"].ToString();
                    chatRoom.Type = dt.Rows[j]["ChatRoomType"].ToString();

                    chatRooms.Add(chatRoom);
                }

                int success = (int)ResponseCodes.Successfull;
                response.ResponseCode = success;
                response.ResponseMessage = ResponseCodes.Successfull.ToString();
                response.Data = chatRooms;
            }
            else
            {
                int noChatRoom = (int)ResponseCodes.NoChatRoom;
                response.ResponseCode = noChatRoom;
                response.ResponseMessage = ResponseCodes.NoChatRoom.ToString();
            }

            return response;
        }
    }
}
