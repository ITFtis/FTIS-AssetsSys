using Dou.Models.DB;
using FTISAssetSys.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FtisHelperAsset.DB.Model;
using System.Drawing;
using FtisHelperAsset.DB;

namespace FTISAssetSys.Controllers
{
    [Dou.Misc.Attr.MenuDef(Name = "報廢", MenuPath = "資產功能管理", Action = "Index", Index = 70, Func = Dou.Misc.Attr.FuncEnum.ALL, AllowAnonymous = false)]

    public class DisposalController : Dou.Controllers.AGenericModelController<AssetDisposals>
    {
        // GET: Disposals
        public ActionResult Index()
        {
            return View();
        }
        protected override IModelEntity<AssetDisposals> GetModelEntity()
        {
            return new Dou.Models.DB.ModelEntity<AssetDisposals>(FtisHelperAsset.DB.Helper.CreateFtisAssetModelContext());
            //return new Dou.Models.DB.ModelEntity<AssetDisposals>(new FTISAssetSys.Models.DouModelContextExt());
        }

        protected override void AddDBObject(IModelEntity<AssetDisposals> dbEntity, IEnumerable<AssetDisposals> objs)
        {   
            //寫入申請人員與時間
            foreach (var obj in objs)
            {
                obj.Applicants = Dou.Context.CurrentUser<User>().Id;
                obj.ApplicationTime = DateTime.Now;
            }        
            base.AddDBObject(dbEntity, objs);
        }

        protected override void UpdateDBObject(IModelEntity<AssetDisposals> dbEntity, IEnumerable<AssetDisposals> objs)
        {
            //更新申請人員與時間
            foreach (var obj in objs)
            {
                obj.Applicants = Dou.Context.CurrentUser<User>().Id;
                obj.ApplicationTime = DateTime.Now;
            }
            base.UpdateDBObject(dbEntity, objs);
        }

        protected override void DeleteDBObject(IModelEntity<AssetDisposals> dbEntity, IEnumerable<AssetDisposals> objs)
        {
            //將Asset總表該資產狀態修改為待報廢

            base.DeleteDBObject(dbEntity, objs);
        }

        /// <summary>
        /// 新增報廢紀錄於DisposalLog
        /// </summary>
        /// <param name="strAssetID"></param>
        public static void AddOrUpdateDisposallog(string strAssetID, string DReason, DateTime? DDate)
        {
            // 20240105, add by markhong 寫入盤點年度
            // 取得今年的年份
            int thisYear = DateTime.Now.Year;
            int nextYear = DateTime.Now.AddYears(1).Year;
            int pastYear = DateTime.Now.AddYears(-1).Year;
            // 建立8月31日的日期時間物件
            DateTime nowAugust31 = new DateTime(thisYear, 8, 1);
            // 建立7月31日的日期時間物件
            DateTime nextJuly01 = new DateTime(nextYear, 7, 31);
            // 如果沒有填寫年度，預設使用使用當年度
            var tmpdate = DDate == null ? DateTime.Now : DDate;

            var reDisposalYear = tmpdate >= nowAugust31 && tmpdate <= nextJuly01 ? thisYear : pastYear;

            var Disposallog = new AssetDisposals()
            {
                AssetID = strAssetID.Trim(),
                DisposalDate = DDate == null ? DateTime.Now : DDate,
                DisposalYear = reDisposalYear,
                Reason = DReason,
                AssetImage = "",
                Applicants = Dou.Context.CurrentUser<User>().Id,
                ApplicationTime = DateTime.Now,
            };

            FtisHelperAsset.DB.Helpe.Asset.AddOrUpdateDisposalLog(Disposallog);
        }
    }
}