using Dou.Controllers;
using Dou.Models.DB;
using FTISAssetSys.Models;
using FtisHelperAsset.DB.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;

namespace FTISAssetSys.Controllers
{
    [Dou.Misc.Attr.MenuDef(Name = "各組資訊設備使用量", MenuPath = "統計專區", Action = "Index", Index = 51, Func = Dou.Misc.Attr.FuncEnum.None, AllowAnonymous = false)]

    public class Rpt_Equipment_GroupController : Dou.Controllers.AGenericModelController<vw_Rpt_Equipment_Group>
    {
        public static List<vw_Rpt_Equipment_Group> _vwREG = new List<vw_Rpt_Equipment_Group>();
        // GET: Statistical
        public ActionResult Index()
        {
            return View();
        }

        protected override IEnumerable<vw_Rpt_Equipment_Group> GetDataDBObject(IModelEntity<vw_Rpt_Equipment_Group> dbEntity, params KeyValueParams[] paras)
        {
            var objs = dbEntity.GetAll();
            _vwREG = objs.ToList();
            return objs;
        }
        //protected override void AddDBObject(IModelEntity<AssetLocations> dbEntity, IEnumerable<AssetLocations> objs)
        //{
        //    base.AddDBObject(dbEntity, objs);
        //    FtisHelperAsset.DB.Helpe.Asset.ResetGetAllLocations();
        //    FtisHelperAsset.DB.LocationsSelectItemsClassImp.ResetLocations();
        //}
        //protected override void UpdateDBObject(IModelEntity<AssetLocations> dbEntity, IEnumerable<AssetLocations> objs)
        //{
        //    base.UpdateDBObject(dbEntity, objs);
        //    FtisHelperAsset.DB.Helpe.Asset.ResetGetAllLocations();
        //    FtisHelperAsset.DB.LocationsSelectItemsClassImp.ResetLocations();
        //}
        //protected override void DeleteDBObject(IModelEntity<AssetLocations> dbEntity, IEnumerable<AssetLocations> objs)
        //{
        //    base.DeleteDBObject(dbEntity, objs);
        //    FtisHelperAsset.DB.Helpe.Asset.ResetGetAllLocations();
        //    FtisHelperAsset.DB.LocationsSelectItemsClassImp.ResetLocations();
        //}
        protected override IModelEntity<vw_Rpt_Equipment_Group> GetModelEntity()
        {
            return new Dou.Models.DB.ModelEntity<vw_Rpt_Equipment_Group>(FtisHelperAsset.DB.Helper.CreateFtisAssetModelContext());
        }
        /// <summary>
        /// 計算最後一列加總資料
        /// </summary>
        /// <returns></returns>
        public ActionResult GetSumData()
        {
            #region 底部總計
            int sumPC = 0;
            int sumNB = 0;
            int sumPAD = 0;
            int sumMonitor = 0;
            int sumM365 = 0;

            foreach (var item in _vwREG)
            {
                sumPC += (int)(item.PC == null ? 0 : item.PC);
                sumNB += (int)(item.NB == null ? 0 : item.NB);
                sumPAD += (int)(item.PAD == null ? 0 : item.PAD);
                sumMonitor += (int)(item.Monitor == null ? 0 : item.Monitor);
                sumM365 += (int)(item.M365 == null ? 0 : item.M365);
            }
            # endregion 底部總計
            //沒有資料就不顯示統計資料
            return Json(new List<string> { sumPC.ToString(), sumNB.ToString(), sumPAD.ToString(), sumMonitor.ToString()
            , sumM365.ToString()});
        }
    }
}