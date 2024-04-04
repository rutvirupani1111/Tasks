import { conn } from "../config/config.js";
import url from "url";
export const get_attendance_report = (req,res)=>
{
    const baseUrl = url.parse(req.url, true);
    console.log(baseUrl);
    console.log(baseUrl.query);
    let currPage = baseUrl.query.pageID;
    let month = baseUrl.query.month;
    let col = baseUrl.query.colName;
    let order = baseUrl.query.orderby;
    
    if (month == undefined)
    {
        month = 12;
    } 
    if((currPage&&col&&order) == undefined)
    {
        col = "Sid",
        order = "asc",
        currPage = 1
    }

    const sql1 = `SELECT Attendance_Master.SID as Sid, Stu.Name as Name, SUM(Attendance) as pDays,((SUM(Attendance)*100)/COUNT(Attendance)) as Average_Att FROM Stu RIGHT JOIN Attendance_Master ON Stu.SID = Attendance_Master.SID where month(Att_Date)='${month}' group by Attendance_Master.SID,Stu.Name ORDER BY ${col} ${order}  LIMIT  ${(currPage-1) * 20},${20};` 

    // const sql = `SELECT 
    //             Attendance_Master.SID AS Sid,
    //             Stu.Name AS FName,
    //             SUM(Attendance_Master.Attendance) AS pDays,
    //             (SUM(Attendance_Master.Attendance) * 100) / COUNT(Attendance_Master.Attendance) AS percent
    //         FROM
    //             Stu
    //                 LEFT JOIN
    //             Attendance_Master ON Attendance_Master.SID = Stu.SID
    //         WHERE
    //             MONTH(Attendance_Master.Att_Date) = '1'
    //         GROUP BY Attendance_Master.SID, Stu.Name;`
    
    conn.query(sql1, function (err, result, fields) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result);
            res.render("Attendance.ejs",
                {
                    PID: currPage,
                    res: result,
                    fields: fields,
                    month: month,
                    col: col,
                    order: order
                })
        }
    });
}