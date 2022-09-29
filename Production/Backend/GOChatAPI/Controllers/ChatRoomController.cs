﻿using GOChatAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;

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
        [Route("group")]
        [HttpGet]
        public ResponseModel GetChatRooms_Group()
        {
            ResponseModel response = new ResponseModel();
            List<object> chatRooms = new List<object>();

            SqlCommand cmd = new SqlCommand("GetChatRoom_Group", con);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter sda = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sda.Fill(dt);

            int i = dt.Rows.Count;

            if (i > 0)
            {
                for (int j = 0; j < i; j++)
                {
                    ChatRoomModel chatRoom = new ChatRoomModel();

                    string imgSrc = String.Empty;

                    if (dt.Rows[j]["ChatRoomPicture"].ToString() != null && dt.Rows[j]["ChatRoomPicture"].ToString() != "")
                    {
                        var base64 = Convert.ToBase64String((byte[])dt.Rows[j]["ChatRoomPicture"]);
                        imgSrc = String.Format("data:image/png;base64, {0}", base64);
                    }

                    chatRoom.ChatRoomID = dt.Rows[j]["ChatRoomID"].ToString();
                    chatRoom.ChatRoomName = dt.Rows[j]["ChatRoomName"].ToString();
                    chatRoom.ProfilePicture = imgSrc;
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

        /// <summary>
        /// Deletes OR blocks private chatroom users, chats and the chatroom itself
        /// </summary>
        /// <param name="UserID">The ID of the user sending the request</param>
        /// <param name="user">The object in which the JSON body will be mapped into</param>
        /// <param name="Base64IPAddress">The IP address of the user sending this request</param>
        /// <param name="RecipientID">The ID of the recipient</param>
        /// <returns>Response object</returns>
        [Route("{UserID}/{RecipientID}/{Base64IPAddress}/{Base64Password}/block")]
        [HttpDelete]
        public ResponseModel Block_Fella(string UserID, string RecipientID, string Base64IPAddress, string Base64Password)
        {
            ResponseModel response = new ResponseModel();

            var ByteCode = Convert.FromBase64String(Base64IPAddress);
            string IPAddress = Encoding.UTF8.GetString(ByteCode);

            var PaswordByteCode = Convert.FromBase64String(Base64Password);
            string Password = Encoding.UTF8.GetString(PaswordByteCode);

            SqlCommand cmdUser = new SqlCommand("GetUserByID", con);
            cmdUser.CommandType = CommandType.StoredProcedure;
            cmdUser.Parameters.AddWithValue("@UserID", UserID);
            cmdUser.Parameters.AddWithValue("@IPAddress", IPAddress);
            SqlDataAdapter sda = new SqlDataAdapter(cmdUser);
            DataTable dt = new DataTable();
            sda.Fill(dt);

            int row = dt.Rows.Count;

            if (row > 0)
            {
                string encryptedPassword = dt.Rows[0]["PWord"].ToString();
                string decryptedPassword = general.Decrypt(encryptedPassword);

                if (Password == decryptedPassword)
                {
                    SqlCommand cmd = new SqlCommand("Block_Fella", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@From_ID", UserID);
                    cmd.Parameters.AddWithValue("@To_ID", RecipientID);
                    cmd.Parameters.AddWithValue("@UserID", UserID);
                    cmd.Parameters.AddWithValue("@IPAddress", IPAddress);

                    con.Open();

                    int i = cmd.ExecuteNonQuery();

                    con.Close();

                    if (i > 0)
                    {
                        response.ResponseCode = (int)ResponseCodes.Successfull;
                        response.ResponseMessage = ResponseCodes.Successfull.ToString();
                    }
                    else
                    {
                        response.ResponseCode = (int)ResponseCodes.Unsuccessfull;
                        response.ResponseMessage = ResponseCodes.Unsuccessfull.ToString();
                    }
                }
                else
                {
                    response.ResponseCode = (int)ResponseCodes.Unsuccessfull;
                    response.ResponseMessage = ResponseCodes.Unsuccessfull.ToString();
                }
            }

            else
            {
                response.ResponseCode = (int)ResponseCodes.Unsuccessfull;
                response.ResponseMessage = ResponseCodes.Unsuccessfull.ToString();
            }

            return response;
        }

        /// <summary>
        /// Temporary blocks or ignores a user in a chatroom
        /// </summary>
        /// <param name="UserID">ID of the user sending the request</param>
        /// <param name="RecipientID">ID of the user to be ignored</param>
        /// <param name="Base64IPAddress">Base64 IP address of user sending the request</param>
        /// <returns>Response object</returns>
        [HttpDelete]
        [Route("{UserID}/{RecipientID}/{Base64IPAddress}/ignore")]
        public ResponseModel Ignore_Fella(string UserID, string RecipientID, string Base64IPAddress)
        {
            ResponseModel response = new ResponseModel();

            var ByteCode = Convert.FromBase64String(Base64IPAddress);
            string IPAddress = Encoding.UTF8.GetString(ByteCode);

            SqlCommand cmd = new SqlCommand("Ignore_Fella", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", UserID);
            cmd.Parameters.AddWithValue("@IPAddress", IPAddress);
            cmd.Parameters.AddWithValue("@RecipientID", RecipientID);

            con.Open();

            int i = cmd.ExecuteNonQuery();

            con.Close();


            if (i > 0)
            {
                response.ResponseCode = (int)ResponseCodes.Successfull;
                response.ResponseMessage = ResponseCodes.Successfull.ToString();
            }
            else
            {
                response.ResponseCode = (int)ResponseCodes.Unsuccessfull;
                response.ResponseMessage = ResponseCodes.Unsuccessfull.ToString();
            }

            return response;
        }

        /// <summary>
        /// Restore Ignored fella into a chatroom
        /// </summary>
        /// <param name="UserID">ID of the user sending the request</param>
        /// <param name="RecipientID">ID of the user to be restored</param>
        /// <param name="Base64IPAddress">Base64 IP address of user sending the request</param>
        /// <returns>Response object</returns>
        [HttpPost]
        [Route("{UserID}/{RecipientID}/{Base64IPAddress}/unignore")]
        public ResponseModel Unignore_Fella(string UserID, string RecipientID, string Base64IPAddress)
        {
            ResponseModel response = new ResponseModel();

            var ByteCode = Convert.FromBase64String(Base64IPAddress);
            string IPAddress = Encoding.UTF8.GetString(ByteCode);

            SqlCommand cmd = new SqlCommand("UnIgnore_fella", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", UserID);
            cmd.Parameters.AddWithValue("@IPAddress", IPAddress);
            cmd.Parameters.AddWithValue("@RecipientID", RecipientID);

            con.Open();

            int i = cmd.ExecuteNonQuery();

            con.Close();


            if (i > 0)
            {
                response.ResponseCode = (int)ResponseCodes.Successfull;
                response.ResponseMessage = ResponseCodes.Successfull.ToString();
            }
            else
            {
                response.ResponseCode = (int)ResponseCodes.Unsuccessfull;
                response.ResponseMessage = ResponseCodes.Unsuccessfull.ToString();
            }

            return response;
        }

        /// <summary>
        /// Gets all chatRooms associated to a user
        /// </summary>
        /// <returns>Response object</returns>
        [Route("{UserID}/{Base64IPAddress}")]
        [HttpGet]
        public ResponseModel GetUserChatRooms(string UserID, string Base64IPAddress)
        {
            ResponseModel response = new ResponseModel();
            List<object> chatRooms = new List<object>();

            var ByteCode = Convert.FromBase64String(Base64IPAddress);
            string IPAddress = Encoding.UTF8.GetString(ByteCode);

            SqlCommand cmd = new SqlCommand("GetUserChatrooms", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", UserID);
            cmd.Parameters.AddWithValue("@IPAddress", IPAddress);
            SqlDataAdapter sda = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sda.Fill(dt);

            int i = dt.Rows.Count;

            if (i > 0)
            {
                for (int j = 0; j < i; j++)
                {
                    ChatRoomModel chatRoom = new ChatRoomModel();

                    string imgSrc = String.Empty;

                    if (dt.Rows[j]["ChatRoomPicture"].ToString() != null && dt.Rows[j]["ChatRoomPicture"].ToString() != "")
                    {
                        var base64 = Convert.ToBase64String((byte[])dt.Rows[j]["ChatRoomPicture"]);
                        imgSrc = String.Format("data:image/png;base64, {0}", base64);
                    }

                    chatRoom.ChatRoomID = dt.Rows[j]["ChatRoomID"].ToString();
                    chatRoom.ChatRoomName = dt.Rows[j]["ChatRoomName"].ToString();
                    chatRoom.ProfilePicture = imgSrc;
                    //chatRoom.Type = dt.Rows[j]["ChatRoomType"].ToString();
                    chatRoom.IsOnline = Convert.ToBoolean(dt.Rows[j]["IsOnline"]);
                    chatRoom.LastSeen = Convert.ToDateTime(dt.Rows[j]["LastSeen"]);
                    chatRoom.Description = dt.Rows[j]["_Description"].ToString();

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
