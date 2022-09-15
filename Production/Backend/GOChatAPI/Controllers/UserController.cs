using GOChatAPI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GOChatAPI.Controllers
{
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {

        SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["GOChat"].ConnectionString);
        UserModel user = new UserModel();
        General general = new General();

        /// <summary>
        /// Get all users of the chat application
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public List<UserModel> Get()
        {
            List<UserModel> users = new List<UserModel>();
            UserModel user = new UserModel();
            users.Add(user);

            return users;
        }

        /// <summary>
        /// Get user by Id
        /// </summary>
        /// <param name="UserID"></param>
        /// <returns></returns>
        [Route("{UserID}")]
        [HttpGet]
        public UserModel Get(string UserID)
        {
            UserModel user = new UserModel();

            SqlCommand cmd = new SqlCommand("GetUserByID", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", UserID);
            SqlDataAdapter sda = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sda.Fill(dt);

            int rows = dt.Rows.Count;

            if (rows > 0)
            {
                for (int i = 0; i < rows; i++)
                {
                    user.UserID = dt.Rows[i]["UserID"].ToString();
                    user.UserName = dt.Rows[i]["UserName"].ToString();
                    user.Email = dt.Rows[i]["Email"].ToString();
                    user.IsOnline = Convert.ToBoolean(dt.Rows[i]["IsOnline"]);
                    user.LastSeen = Convert.ToDateTime(dt.Rows[i]["LastSeen"]);
                    user.Response = true;
                }
            }
            else
            {
                user.Response = false;
            }

            return user;
        }

        /// <summary>
        /// Check user login credidentials
        /// </summary>
        /// <param name="userModel"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("login")]
        public UserModel Login(UserModel userModel)
        {
            UserModel user = new UserModel();
            ValidateUser validate = new ValidateUser();

            string Password = String.Empty;

           /* SqlCommand cmdEmail = new SqlCommand("select top(1) * from Users where Email=@Email");
            cmdEmail.Parameters.AddWithValue("@Email", userModel.Email);
            SqlDataReader read = cmdEmail.ExecuteReader();

            while (read.Read())
            {
                Password = general.Decrypt(read["PWord"].ToString());
            }
            */
            SqlCommand cmd = new SqlCommand("CheckUserLogin", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Email", userModel.Email);
            SqlDataAdapter sda = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sda.Fill(dt);

            int rows = dt.Rows.Count;

            if (rows > 0)
            {
                for (int i = 0; i < rows; i++)
                {
                    string encrypted = dt.Rows[i]["PWord"].ToString();
                    Password = general.Decrypt(encrypted);

                    if (userModel.Password==Password)
                    {
                        user.UserID = dt.Rows[i]["UserID"].ToString();
                        user.UserName = dt.Rows[i]["UserName"].ToString();
                        user.Email = dt.Rows[i]["Email"].ToString();
                        user.IsOnline = Convert.ToBoolean(dt.Rows[i]["IsOnline"]);
                        user.LastSeen = Convert.ToDateTime(dt.Rows[i]["LastSeen"]);
                        validate.UserExists = true;

                        if (Convert.ToInt32(dt.Rows[i]["Authenticated"]) > 0)
                        {
                            validate.IsAuthenticated = true;
                        }
                        else
                        {
                            validate.IsAuthenticated = false;
                        }

                        user.Response = validate;
                    }

                    else
                    {
                        validate.UserExists = false;
                        user.Response = validate;
                    }
                }
            }

            else
            {
                validate.UserExists = false;
                user.Response = validate;
            }

            return user;
        }

        /// <summary>
        /// To change the online state of a user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [Route("isOnline")]
        [HttpPut]
        public string IsOnline(UserModel user)
        {
            string msg = String.Empty;
            try
            {
                SqlCommand cmd = new SqlCommand("IsOnline", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserID", user.UserID);
                cmd.Parameters.AddWithValue("@IsOnline", user.IsOnline.ToString());

                con.Open();
                int i = cmd.ExecuteNonQuery();
                con.Close();

                if (i > 0)
                {
                    msg = "User is onine...";
                }
                else
                {
                    msg = "Error...";
                }
            }
            catch (Exception ex)
            {
                msg = $"Error {ex}";
            }

            return msg;
        }

        /// <summary>
        /// Change user lastseen to NOW...
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        [Route("lastSeen/{UserId}")]
        [HttpPut]
        public string LastSeen(string UserId)
        {
            string msg = String.Empty;

            try
            {
                SqlCommand cmd = new SqlCommand("LastSeen", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@LastSeen", DateTime.Now);

                con.Open();
                int i = cmd.ExecuteNonQuery();
                con.Close();

                if (i > 0)
                {
                    msg = $"User was last seen at {DateTime.Now}";
                }
                else
                {
                    msg = "Error...";
                }
            }
            catch (Exception ex)
            {
                msg = $"Error {ex}";
            }

            return msg;
        }

        [HttpPost]
        [Route("register")]
        public bool Register(UserModel user)
        {
            bool msg = false;

            string Id = Guid.NewGuid().ToString();
            DateTime date = DateTime.Now;
            int code = general.Random();
            string OTP = general.Encrypt(code.ToString());
            string Password = general.Encrypt(user.Password);

            try
            {
                SqlCommand cmd = new SqlCommand("Register", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", Id);
                cmd.Parameters.AddWithValue("@UserName", user.UserName);
                cmd.Parameters.AddWithValue("@Password", Password);
                cmd.Parameters.AddWithValue("@Email", user.Email);
                //cmd.Parameters.AddWithValue("@ConfirmCode", OTP);
                cmd.Parameters.AddWithValue("@DateCreated", date);

                con.Open();

                int i = cmd.ExecuteNonQuery();

                if (i > 0)
                {
                    //general.Mail(user.Email, "onukwilip@gmail.com", "GO Chat", user.UserName, code.ToString(), "no-reply");
                    //general.Mail2(user.Email, code.ToString(), "No-reply");
                    msg = true;
                }
                else 
                { 
                    msg = false;
                }

                con.Close();
            }

            catch (Exception)
            {
                msg = false;
            }

            return msg;
        }

        [HttpPut]
        [Route("updateOTP")]
        public bool UpdateOTP(UserModel user)
        {
            bool msg = false;

            int code = general.Random();
            string OTP = general.Encrypt(code.ToString());

            try
            {
                SqlCommand cmd = new SqlCommand("InsertOTP", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Email", user.Email);
                cmd.Parameters.AddWithValue("@ConfirmCode", OTP);

                con.Open();

                int i = cmd.ExecuteNonQuery();

                if (i > 0)
                {
                    string mailmsg= general.Mail(user.Email, "onukwilip@gmail.com", "GO Chat", user.UserName, code.ToString(), "no-reply");
                    //string mailmsg = general.Mail2(user.Email, code.ToString(), "No-reply");
                    msg = true;
                }
                else
                {
                    msg = false;
                }

                con.Close();
            }

            catch (Exception)
            {
                msg = false;
            }

            return msg;
        }

        [HttpPut]
        [Route("eraseOTP")]
        public bool EraseOTP(UserModel user)
        {
            bool msg = false;

            try
            {
                SqlCommand cmd = new SqlCommand("eraseOTP", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Email", user.Email);

                con.Open();

                int i = cmd.ExecuteNonQuery();

                if (i > 0)
                {
                    msg = true;
                }
                else
                {
                    msg = false;
                }

                con.Close();
            }

            catch (Exception)
            {
                msg = false;
            }

            return msg;
        }

        [HttpPut]
        [Route("confirmOTP")]
        public bool ConfirmOTP(UserModel user)
        {
            bool msg = false;

            try
            {
                SqlCommand cmd = new SqlCommand("selectOTP", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Email", user.Email);

                con.Open();

                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                int count = dt.Rows.Count;

                if (count > 0)
                {
                    string OTP = general.Decrypt(dt.Rows[0]["ConfirmCode"].ToString());

                    if (user.OTP == OTP)
                    {
                        SqlCommand cmdTrue = new SqlCommand("AuthenticateUser", con);

                        cmdTrue.CommandType = CommandType.StoredProcedure;
                        cmdTrue.Parameters.AddWithValue("@Email", user.Email);
                        
                         int j = cmdTrue.ExecuteNonQuery();

                         if (j > 0)
                         {
                             msg = true;
                         }
                         else
                         {
                             msg = false;
                         } 
                    }
                    else
                    {
                        msg = false;
                    }
                }
                else
                {
                    msg = false;
                }

                con.Close();
            }
            catch (Exception)
            {
                msg = false;
            }
            
            return msg;
        }

        [HttpPost]
        [Route("getUserByEmail")]
        public List<UserModel> GetUser(UserModel body)
        {
            UserModel user = new UserModel();
            ValidateUser validate = new ValidateUser();

            List<UserModel> users = new List<UserModel>();

            SqlCommand cmd = new SqlCommand("CheckUserLogin", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Email", body.Email);
            SqlDataAdapter sda = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sda.Fill(dt);

            int rows = dt.Rows.Count;

            if (rows > 0)
            {
                for (int i = 0; i < rows; i++)
                {
                    user.UserID = dt.Rows[i]["UserID"].ToString();
                    user.UserName = dt.Rows[i]["UserName"].ToString();
                    user.Email = dt.Rows[i]["Email"].ToString();
                    user.IsOnline = Convert.ToBoolean(dt.Rows[i]["IsOnline"]);
                    user.LastSeen = Convert.ToDateTime(dt.Rows[i]["LastSeen"]);

                    validate.UserExists = true;

                    if (Convert.ToInt32(dt.Rows[i]["Authenticated"]) > 0)
                    {
                        validate.IsAuthenticated = true;
                    }
                    else
                    {
                        validate.IsAuthenticated = false;
                    }

                    user.Response = validate;
                }
            }
            else
            {
                user.Response = validate;
            }

            users.Add(user);

            return users;
        }
    }
}
