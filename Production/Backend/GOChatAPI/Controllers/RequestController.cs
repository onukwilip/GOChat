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
    /// Handles all API's responsible for sending, validating and recieving requests(Friend and chatroom requests)
    /// </summary>
    [RoutePrefix("api/user/requests")]
    public class RequestController : ApiController
    {
        SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["GOChat"].ConnectionString);
        General general = new General();

        /// <summary>
        /// Creates a new request in the database
        /// </summary>
        /// <returns>Response object</returns>
        /// <param name="request">Maps the body into a request object</param>
        [HttpPost]
        public ResponseModel CreateRequest(RequestModel request)
        {
            ResponseModel response = new ResponseModel();

            SqlCommand cmd = new SqlCommand("CreateRequest", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@From_ID", request.From);
            cmd.Parameters.AddWithValue("@To_ID", request.From);
            cmd.Parameters.AddWithValue("@Message", request.Message);

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

        /// <summary>
        /// Gets all requests pertaining to a specific user
        /// </summary>
        /// <param name="UserID">Parameter for id of user</param>
        /// <returns>Response object</returns>
        [HttpGet]
        [Route("{UserID}")]
        public ResponseModel GetRequests(string UserID)
        {
            ResponseModel response = new ResponseModel();
            List<object> requests = new List<object>();

            SqlCommand cmd = new SqlCommand("", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("", UserID);

            SqlDataAdapter sda = new SqlDataAdapter();
            DataTable dt = new DataTable();
            sda.Fill(dt);

            int i = dt.Rows.Count;

            if (i > 0)
            {
                for (int j = 0; j < i; j++)
                {
                    RequestModel request = new RequestModel();
                    UserModel from = new UserModel();
                    UserModel to = new UserModel();

                    request.From = from;
                    request.To = to;
                    request.Message = dt.Rows[j]["_Message"].ToString();

                    requests.Add(request);
                }

                int success = (int)ResponseCodes.Successfull;
                response.ResponseCode = success;
                response.ResponseMessage = ResponseCodes.Successfull.ToString();
                response.Data = requests;
            }

            else
            {
                int noRequests = (int)ResponseCodes.NoRequests;
                response.ResponseCode = noRequests;
                response.ResponseMessage = ResponseCodes.NoRequests.ToString();
            }

            return response;
        }
    }
}
