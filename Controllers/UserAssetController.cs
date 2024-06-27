using Dou.Controllers;
using Dou.Misc;
using Dou.Models.DB;
using FTISAssetSys.Models;
using FtisHelperAsset.DB.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FTISAssetSys.Controllers
{
    [Dou.Misc.Attr.MenuDef(Name = "個人資產資料", MenuPath = "", Action = "Index", Index = 60, Func = Dou.Misc.Attr.FuncEnum.ALL, AllowAnonymous = false)]

    public class UserAssetController : Dou.Controllers.AGenericModelController<AssetUser>
    {
        
        // GET: UserAsset
        public ActionResult Index()
        {
            return View();
        }
        //protected override void AddDBObject(IModelEntity<Assets> dbEntity, IEnumerable<Assets> objs)
        //{
        //    base.AddDBObject(dbEntity, objs);
        //    FtisHelperAsset.DB.Helpe.Asset.ResetGetAllAssets();
        //    FtisHelperAsset.DB.AssetIDSelectItemsClassImp.ResetAssets();
        //}
        //protected override void UpdateDBObject(IModelEntity<Assets> dbEntity, IEnumerable<Assets> objs)
        //{
        //    base.UpdateDBObject(dbEntity, objs);
        //    FtisHelperAsset.DB.Helpe.Asset.ResetGetAllAssets();
        //    FtisHelperAsset.DB.AssetIDSelectItemsClassImp.ResetAssets();
        //}
        //protected override void DeleteDBObject(IModelEntity<Assets> dbEntity, IEnumerable<Assets> objs)
        //{
        //    base.DeleteDBObject(dbEntity, objs);
        //    FtisHelperAsset.DB.Helpe.Asset.ResetGetAllAssets();
        //    FtisHelperAsset.DB.AssetIDSelectItemsClassImp.ResetAssets();
        //}
        protected override IEnumerable<AssetUser> GetDataDBObject(IModelEntity<AssetUser> dbEntity, params KeyValueParams[] paras)
        {
            string userid = Dou.Context.CurrentUser<User>().Id;
            var dbContext = FtisHelperAsset.DB.Helper.CreateFtisAssetModelContext();
            Dou.Models.DB.IModelEntity<Assets> model = new Dou.Models.DB.ModelEntity<Assets>(dbContext);
            var _AssetID = HelperUtilities.GetFilterParaValue(paras, "AssetID");


            var datas = model.GetAll().Where(o => o.CustodianID == userid);
            var querydatas = (from a in datas
                         select new AssetUser()
                         {
                             AssetID = a.AssetID,
                             Name = a.Name,
                             Company = a.Company,
                             CateID = a.CateID,
                             SubCateID = a.SubCateID,
                             Specification = a.Specification,
                             LocationID = a.LocationID,
                             CustodianID = a.CustodianID,
                             StatusID = a.StatusID,
                             Remark = a.Remark,
                         }).ToArray();

            var res = !string.IsNullOrEmpty(_AssetID) ? querydatas.Where(x => x.AssetID == _AssetID) : querydatas;

            res = !string.IsNullOrEmpty(_AssetID) ? querydatas.Where(x => x.AssetID == _AssetID) : res;

            return res;
            //return (base.GetDataDBObject(dbEntity, paras) as IQueryable<AssetUser>).Where(o => o.CustodianID == userid);
        }

        public override DataManagerOptions GetDataManagerOptions()
        {
            var options = base.GetDataManagerOptions();
            //options.GetFiled("CateID").visible = false;
            //options.GetFiled("CateID").visibleEdit = false;
            //options.GetFiled("SubCateID").visible = false;
            //options.GetFiled("SubCateID").visibleEdit = false;
            //options.GetFiled("PurchaseDate").visible = false;
            //options.GetFiled("PurchaseDate").visibleEdit = false;

            //options.GetFiled("UnitPrice").visible = false;
            //options.GetFiled("UnitPrice").visibleEdit = false;
            //options.GetFiled("PurchasePrice").visible = false;
            //options.GetFiled("PurchasePrice").visibleEdit = false;
            //options.GetFiled("Warranty").visible = false;
            //options.GetFiled("Warranty").visibleEdit = false;
            //options.GetFiled("Durability").visible = false;
            //options.GetFiled("Durability").visibleEdit = false;
            //options.GetFiled("SupplierID").visible = false;
            //options.GetFiled("SupplierID").visibleEdit = false;
            //options.GetFiled("OrderNo").visible = false;
            //options.GetFiled("OrderNo").visibleEdit = false;
            //options.GetFiled("RecorderID").visible = false;
            //options.GetFiled("RecorderID").visibleEdit = false;

            //options.singleDataEdit = false;

            //options.singleDataEditCompletedReturnUrl = System.Web.HttpContext.Current.Request.UrlReferrer == null ?
            //    Dou.Context.CurrentUser<User>().DefaultPage : System.Web.HttpContext.Current.Request.UrlReferrer.ToString();
            //options.datas = new User[] { Dou.Context.CurrentUser<User>() };
            //var dbe = GetModelEntity();
            //options.datas = dbe.GetAll(s => s.CustodianID == userid);
            //(Dou.Misc.HelperUtilities.GetKeyValues<F22cmmEmpData>(((Dou.Models.DB.ModelEntity<F22cmmEmpData>)dbe)._context) };
            //options.editformWindowStyle = "showEditformOnly";
            return options;
        }
        protected override IModelEntity<AssetUser> GetModelEntity()
        {
            return new Dou.Models.DB.ModelEntity<AssetUser>(FtisHelperAsset.DB.Helper.CreateFtisAssetModelContext());
            //return new Dou.Models.DB.ModelEntity<Assets>(new FTISAssetSys.Models.DouModelContextExt());
        }
    }
}