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
    [Dou.Misc.Attr.MenuDef(Name = "各項設備數量表", MenuPath = "統計專區", Action = "Index", Index = 50, Func = Dou.Misc.Attr.FuncEnum.None, AllowAnonymous = false)]

    public class Rpt_EquipmentController : Dou.Controllers.AGenericModelController<vw_Rpt_Equipment>
    {
        public static List<vw_Rpt_Equipment> _vwRE = new List<vw_Rpt_Equipment>();
        // GET: Statistical
        public ActionResult Index()
        {
            return View();
        }

        protected override IEnumerable<vw_Rpt_Equipment> GetDataDBObject(IModelEntity<vw_Rpt_Equipment> dbEntity, params KeyValueParams[] paras)
        {
            var objs = dbEntity.GetAll().OrderBy(r => r.CateID);
            _vwRE = objs.ToList();
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
        protected override IModelEntity<vw_Rpt_Equipment> GetModelEntity()
        {
            return new Dou.Models.DB.ModelEntity<vw_Rpt_Equipment>(FtisHelperAsset.DB.Helper.CreateFtisAssetModelContext());
        }
        /// <summary>
        /// 計算最後一列加總資料
        /// </summary>
        /// <returns></returns>
        public ActionResult GetSumData()
        {
            #region 底部總計
            int sumA = 0;
            int sumB = 0;
            int sumC = 0;
            int sumABC = 0;
            int sumAI = 0;
            int sumSurplus = 0;
            int sumLoses = 0;

            foreach (var item in _vwRE)
            {
                sumA += (int)(item.Counts_Default_Inventory == null ? 0 : item.Counts_Default_Inventory);
                sumB += (int)(item.Counts_NewAdd == null ? 0 : item.Counts_NewAdd);
                sumC += (int)(item.Counts_Disposal == null ? 0 : item.Counts_Disposal);
                sumABC += (int)(item.Counts_Period == null ? 0 : item.Counts_Period);
                sumAI += (int)(item.Counts_Actual_Inventory == null ? 0 : item.Counts_Actual_Inventory);
                sumSurplus += (int)(item.Counts_Surplus == null ? 0 : item.Counts_Surplus);
                sumLoses += (int)(item.Counts_Losses == null ? 0 : item.Counts_Losses);
            }
            # endregion 底部總計
            //沒有資料就不顯示統計資料
            return Json(new List<string> { sumA.ToString(), sumB.ToString(), sumC.ToString(),
                sumABC.ToString(), sumAI.ToString(), sumSurplus.ToString(), sumLoses.ToString()});
        }
    }
}