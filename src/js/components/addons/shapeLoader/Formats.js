let PLEIADES = [
    {'Name':'datastrip','Type':'String'},      
    {'Name':'orb','Type':'Float'},
    {'Name':'satel','Type':'String'},
    {'Name':'dataq_star','Type':'Date'},
    {'Name':'dataq_end','Type':'Date'},
    {'Name':'sensor','Type':'String'},
    {'Name':'cloud_per','Type':'Float'},
    {'Name':'snow_per','Type':'Float'},
    {'Name':'incid_ang','Type':'Float'},
    {'Name':'sun_azimut','Type':'Float'},
    {'Name':'sun_elevat','Type':'Float'},
    {'Name':'orient_ang','Type':'Float'},
    {'Name':'across_ang','Type':'Float'},
    {'Name':'along_ang','Type':'Float'},
    {'Name':'combin_ang','Type':'Float'},
    {'Name':'roll_ang','Type':'Float'},
    {'Name':'pitch_ang','Type':'Float'},
    {'Name':'url_ql','Type':'String'},
    // {'Name':'url','Type':'String'},  
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
 ];

 let PLEIADES_L = [
    {'Name': 'scene_id', 'Type': 'String'},
    {'Name': 'url', 'Type': 'String'},
    {'Name': 'x1', 'Type': 'Float'},
    {'Name': 'y1', 'Type': 'Float'},
    {'Name': 'x2', 'Type': 'Float'},
    {'Name': 'y2', 'Type': 'Float'},
    {'Name': 'x3', 'Type': 'Float'},
    {'Name': 'y3', 'Type': 'Float'},
    {'Name': 'x4', 'Type': 'Float'},
    {'Name': 'y4', 'Type': 'Float'},
    {'Name': 'ds_id', 'Type': 'String'},
    {'Name': 'satellite', 'Type': 'String'},
    {'Name': 'sensor_mod', 'Type': 'String'},
    {'Name': 'sun_azimut', 'Type': 'Float'},
    {'Name': 'sun_elevat', 'Type': 'Float'},
    {'Name': 'view_angle', 'Type': 'Float'},
    {'Name': 'img_start', 'Type': 'Date'},
    {'Name': 'order_id', 'Type': 'String'},
    {'Name': 'pack_id', 'Type': 'String'},
    {'Name': 'del_id', 'Type': 'String'},
    {'Name': 'com_id', 'Type': 'String'},
    {'Name': 'qlurl', 'Type': 'String'},
 ]

 let DG_products = [
    {'Name':'catalogid','Type':'String'},    
    {'Name':'acqdate','Type':'Date'},
    {'Name':'mnoffnadir','Type':'Float'},
    {'Name':'mxoffnadir','Type':'Float'},
    {'Name':'avoffnadir','Type':'Float'},
    {'Name':'mnsunazim','Type':'Float'},
    {'Name':'mxsunazim','Type':'Float'},
    {'Name':'avsunazim','Type':'Float'},
    {'Name':'mnsunelev','Type':'Float'},
    {'Name':'mxsunelev','Type':'Float'},
    {'Name':'avsunelev','Type':'Float'},
    {'Name':'mntargetaz','Type':'Float'},
    {'Name':'mxtargetaz','Type':'Float'},
    {'Name':'avtargetaz','Type':'Float'},
    {'Name':'mnpanres','Type':'Float'},
    {'Name':'mxpanres','Type':'Float'},
    {'Name':'avpanres','Type':'Float'},
    {'Name':'mnmultires','Type':'Float'},
    {'Name':'mxmultires','Type':'Float'},
    {'Name':'avmultires','Type':'Float'},
    {'Name':'stereopair','Type':'String'},
    {'Name':'browseurl','Type':'String'},
    {'Name':'cloudcover','Type':'Float'},
    {'Name':'platform','Type':'String'},        
    {'Name':'imagebands','Type':'String'},
    // {'Name':'url','Type':'String'},    
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
];

let DG_products_L = [
    {'Name':'scene_id', 'Type':'String'},
    {'Name':'part_id', 'Type':'String'},
    {'Name':'cat_id', 'Type':'String'},
    {'Name':'satellite', 'Type':'String'},
    {'Name':'cloudsp', 'Type':'Float'},
    {'Name':'view_angle', 'Type':'Float'},
    {'Name':'sun_elevat', 'Type':'Float'},
    {'Name':'img_start', 'Type':'Date'},
    {'Name':'volume_lab', 'Type':'String'},
    {'Name':'cust_order', 'Type':'String'},
    {'Name':'area_desc', 'Type':'String'},
    {'Name':'meta_ts', 'Type':'String'},
    {'Name':'url', 'Type':'String'},
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
];

let RAPIDEYE = [
    {'Name':'scid','Type':'String'},
    {'Name':'sunaz','Type':'Float'},
    {'Name':'blkfill','Type':'Float'},
    {'Name':'catid','Type':'Integer'},    
    {'Name':'area','Type':'Float'},
    {'Name':'cc','Type':'Integer'},
    {'Name':'acqtime','Type':'Date'},
    {'Name':'ullat','Type':'Float'},
    {'Name':'udp','Type':'Integer'},
    {'Name':'azang','Type':'Float'},
    {'Name':'tileid','Type':'Float'},
    {'Name':'sunel','Type':'Float'},
    {'Name':'ullon','Type':'Float'},
    {'Name':'imgurl','Type':'String'},
    {'Name':'vwangle','Type':'Float'},
    // {'Name':'url','Type':'String'},
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
];

let KOMPSAT = [
    {'Name':'productid','Type':'String'},    
    {'Name':'platfSNm','Type':'String'},
    {'Name':'platfSer','Type':'String'},
    {'Name':'orbit','Type':'Integer'},
    {'Name':'orbitDir','Type':'Integer'},
    {'Name':'frame','Type':'Integer'},
    {'Name':'track','Type':'Integer'},
    {'Name':'resTitle','Type':'String'},
    {'Name':'begin','Type':'Date'},
    {'Name':'end','Type':'Date'},
    {'Name':'cloudCovePerc','Type':'Integer'},
    {'Name':'bgFileName','Type':'String'},
    {'Name':'offNadirAngle','Type':'Float'},
    {'Name':'url','Type':'String'},
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
];


let EROS = [
    {'Name':'id','Type':'Integer'},
    {'Name':'row','Type':'Integer'},
    {'Name':'nbound','Type':'Float'},
    {'Name':'sbound','Type':'Float'},
    {'Name':'wbound','Type':'Float'},
    {'Name':'ebound','Type':'Float'},
    {'Name':'platform','Type':'String'},
    {'Name':'sceneid','Type':'String'},    
    {'Name':'acdate','Type':'Date'},
    {'Name':'filename','Type':'String'},
    {'Name':'volume','Type':'String'},
    {'Name':'cld','Type':'Integer'},
    {'Name':'url','Type':'String'},
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
];

let GF_ZY = [
    {'Name':'productid','Type':'String'},
    {'Name':'jh','Type':'String'},    
    {'Name':'satellitei','Type':'String'},
    {'Name':'datatype','Type':'String'},
    {'Name':'sx','Type':'Date'},
    {'Name':'scenepath','Type':'String'},
    {'Name':'scenerow','Type':'String'},
    {'Name':'rasterfile','Type':'String'},
    {'Name':'pc','Type':'String'},
    {'Name':'cloudcover','Type':'Integer'},
    {'Name':'url','Type':'String'},
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
];

let LANDSAT_8 = [
    {'Name':'browseavailable','Type':'String'},
    {'Name':'browseurl','Type':'String'},
    {'Name':'sceneid','Type':'String'},    
    {'Name':'sensor','Type':'String'},
    {'Name':'acquisitiondate','Type':'Date'},
    {'Name':'dateupdated','Type':'Date'},
    {'Name':'path','Type':'Integer'},
    {'Name':'row','Type':'Integer'},
    {'Name':'upperleftcornerlatitude','Type':'Float'},
    {'Name':'upperleftcornerlongitude','Type':'Float'},
    {'Name':'upperrightcornerlatitude','Type':'Float'},
    {'Name':'upperrightcornerlongitude','Type':'Float'},
    {'Name':'lowerleftcornerlatitude','Type':'Float'},
    {'Name':'lowerleftcornerlongitude','Type':'Float'},
    {'Name':'lowerrightcornerlatitude','Type':'Float'},
    {'Name':'lowerrightcornerlongitude','Type':'Float'},
    {'Name':'scenecenterlatitude','Type':'Float'},
    {'Name':'scenecenterlongitude','Type':'Float'},
    {'Name':'cloudcover','Type':'Integer'},
    {'Name':'cloudcoverfull','Type':'Float'},
    {'Name':'dayornight','Type':'String'},
    {'Name':'sunelevation','Type':'Float'},
    {'Name':'sunazimuth','Type':'Float'},
    {'Name':'receivingstation','Type':'String'},
    {'Name':'scenestarttime','Type':'String'},
    {'Name':'scenestoptime','Type':'String'},
    {'Name':'imagequality1','Type':'Integer'},
    {'Name':'data_type_l1','Type':'String'},
    {'Name':'carturl','Type':'String'},
    {'Name':'geometric_rmse_model_x','Type':'Integer'},
    {'Name':'geometric_rmse_model_y','Type':'Integer'},
    {'Name':'full_partial_scene','Type':'String'},
    {'Name':'nadir_offnadir','Type':'String'},
    {'Name':'processing_software_version','Type':'String'},
    {'Name':'cpf_name','Type':'String'},
    {'Name':'rlut_file_name','Type':'String'},
    {'Name':'bpf_name_oli','Type':'String'},
    {'Name':'bpf_name_tirs','Type':'String'},
    {'Name':'id','Type':'Integer'},
    {'Name':'landsat_product_id','Type':'String'},
    // {'Name':'url','Type':'String'},
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
];

let IKONOS = [
    {'Name':'image_id','Type':'String'},
    {'Name':'order_id','Type':'String'},
    {'Name':'source_abr','Type':'String'},
    {'Name':'source','Type':'String'},
    {'Name':'sens_mode','Type':'String'},
    {'Name':'strip_id','Type':'String'},
    {'Name':'scene_id','Type':'String'},    
    {'Name':'coll_date','Type':'String'},
    {'Name':'month','Type':'Integer'},
    {'Name':'year','Type':'Integer'},
    {'Name':'gsd','Type':'Float'},
    {'Name':'sqkm','Type':'Integer'},
    {'Name':'spatialref','Type':'String'},
    {'Name':'ranking','Type':'Integer'},
    {'Name':'elev_angle','Type':'Float'},
    {'Name':'azim_angle','Type':'Float'},
    {'Name':'clouds','Type':'Integer'},
    {'Name':'sun_elev','Type':'Float'},
    {'Name':'sun_angle','Type':'Float'},
    {'Name':'stereo_id','Type':'String'},
    {'Name':'data_owner','Type':'String'},
    {'Name':'ul_lat','Type':'Float'},
    {'Name':'ul_lon','Type':'Float'},
    {'Name':'ur_lat','Type':'Float'},
    {'Name':'ur_lon','Type':'Float'},
    {'Name':'ll_lat','Type':'Float'},
    {'Name':'ll_lon','Type':'Float'},
    {'Name':'lr_lat','Type':'Float'},
    {'Name':'lr_lon','Type':'Float'},
    {'Name':'georectify','Type':'Integer'},
    {'Name':'image_url','Type':'String'},
    {'Name':'world_url','Type':'String'},
    {'Name':'metadata','Type':'String'},
    {'Name':'product','Type':'String'},
    // {'Name':'url','Type':'String'},
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
];

let WV1 = [
    {'Name':'catalogid','Type':'String'},    
    {'Name':'acqdate','Type':'Date'},
    {'Name':'mnoffnadir','Type':'Integer'},
    {'Name':'mxoffnadir','Type':'Integer'},
    {'Name':'avoffnadir','Type':'Integer'},
    {'Name':'mnsunazim','Type':'Float'},
    {'Name':'mxsunazim','Type':'Float'},
    {'Name':'avsunazim','Type':'Float'},
    {'Name':'mnsunelev','Type':'Float'},
    {'Name':'mxsunelev','Type':'Float'},
    {'Name':'avsunelev','Type':'Float'},
    {'Name':'mntargetaz','Type':'Float'},
    {'Name':'mxtargetaz','Type':'Float'},
    {'Name':'avtargetaz','Type':'Float'},
    {'Name':'mnpanres','Type':'Integer'},
    {'Name':'mxpanres','Type':'Integer'},
    {'Name':'avpanres','Type':'Integer'},
    {'Name':'mnmultires','Type':'Integer'},
    {'Name':'mxmultires','Type':'Integer'},
    {'Name':'avmultires','Type':'Integer'},
    {'Name':'stereopair','Type':'String'},
    {'Name':'browseurl','Type':'String'},
    {'Name':'cloudcover','Type':'Integer'},
    {'Name':'platform','Type':'String'},
    // {'Name':'url','Type':'String'},    
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
    {'Name':'imagebands','Type':'String'}
];

let BKA = [
    {'Name':'id','Type':'String'},
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
    {'Name':'typeinformation','Type':'String'},
    {'Name':'lastupdatedate','Type':'Date'},
    {'Name':'satellite','Type':'String'},
    {'Name':'cyclenumber','Type':'String'},
    {'Name':'acquisitiontime','Type':'Date'},
    {'Name':'sensortype','Type':'String'},
    {'Name':'sensorresolution','Type':'String'},
    {'Name':'cloudcover','Type':'Integer'},
    {'Name':'viewingangle','Type':'Float'},
    {'Name':'sunelevation','Type':'Float'},
    {'Name':'sunazimuth','Type':'Float'}
];

let SPOT5 = [
    {'Name':'a21','Type':'String'},    
    {'Name':'sc_num','Type':'Integer'},
    {'Name':'seg_num','Type':'Integer'},
    {'Name':'satel','Type':'Integer'},
    {'Name':'ang_inc','Type':'Float'},
    {'Name':'ang_acq','Type':'Integer'},
    {'Name':'date_acq','Type':'String'},
    {'Name':'month_acq','Type':'String'},
    {'Name':'cloud_quot','Type':'String'},
    {'Name':'cloud_per','Type':'Integer'},
    {'Name':'snow_quot','Type':'String'},
    {'Name':'lat_cen','Type':'Float'},
    {'Name':'lon_cen','Type':'Float'},
    {'Name':'lat_up_l','Type':'Float'},
    {'Name':'lon_up_l','Type':'Float'},
    {'Name':'lat_up_r','Type':'Float'},
    {'Name':'lon_up_r','Type':'Float'},
    {'Name':'lat_lo_l','Type':'Float'},
    {'Name':'lon_lo_l','Type':'Float'},
    {'Name':'lat_lo_r','Type':'Float'},
    {'Name':'lon_lo_r','Type':'Float'},
    {'Name':'resol','Type':'Integer'},
    {'Name':'mode','Type':'String'},
    {'Name':'type','Type':'String'},
    {'Name':'url_ql','Type':'String'},
    // {'Name':'url','Type':'String'},
    {'Name':'x1','Type':'Float'},
    {'Name':'y1','Type':'Float'},
    {'Name':'x2','Type':'Float'},
    {'Name':'y2','Type':'Float'},
    {'Name':'x3','Type':'Float'},
    {'Name':'y3','Type':'Float'},
    {'Name':'x4','Type':'Float'},
    {'Name':'y4','Type':'Float'},
];

let Formats = {
    KOMPSAT,
    DG_products, 
    DG_products_L,
    PLEIADES, 
    PLEIADES_L,
    RAPIDEYE,
    EROS,
    GF_ZY,
    LANDSAT_8,
    IKONOS,
    BKA,
    WV1,
    SPOT5,
    'SPOT-6_7': [
        {'Name':'datastrip','Type':'String'},          
        {'Name':'orb','Type':'Float'},
        {'Name':'satel','Type':'String'},
        {'Name':'dataq_star','Type':'Date'},
        {'Name':'dataq_end','Type':'Date'},
        {'Name':'sensor','Type':'String'},
        {'Name':'cloud_per','Type':'Float'},
        {'Name':'snow_per','Type':'Float'},
        {'Name':'incid_ang','Type':'Float'},
        {'Name':'sun_azimut','Type':'Float'},
        {'Name':'sun_elevat','Type':'Float'},
        {'Name':'orient_ang','Type':'Float'},
        {'Name':'across_ang','Type':'Float'},
        {'Name':'along_ang','Type':'Float'},
        {'Name':'combin_ang','Type':'Float'},
        {'Name':'roll_ang','Type':'Float'},
        {'Name':'pitch_ang','Type':'Float'},
        {'Name':'sc_nb','Type':'Float'},
        {'Name':'url_ql','Type':'String'},
        // {'Name':'url','Type':'String'},
        {'Name':'x1','Type':'Float'},
        {'Name':'y1','Type':'Float'},
        {'Name':'x2','Type':'Float'},
        {'Name':'y2','Type':'Float'},
        {'Name':'x3','Type':'Float'},
        {'Name':'y3','Type':'Float'},
        {'Name':'x4','Type':'Float'},
        {'Name':'y4','Type':'Float'},  
    ],
    'SPOT-6_7_L': [
        {'Name':'id','Type':'Integer'},
        {'Name':'row','Type':'Integer'},
        {'Name':'nbound','Type':'Float'},
        {'Name':'sbound','Type':'Float'},
        {'Name':'wbound','Type':'Float'},
        {'Name':'ebound','Type':'Float'},
        {'Name':'platform','Type':'String'},
        {'Name':'sceneid','Type':'String'},        
        {'Name':'acdate','Type':'String'},
        {'Name':'filename','Type':'String'},
        {'Name':'volume','Type':'String'},
        {'Name':'cld','Type':'Integer'},
        {'Name':'url','Type':'String'},
        {'Name':'x1','Type':'Float'},
        {'Name':'y1','Type':'Float'},
        {'Name':'x2','Type':'Float'},
        {'Name':'y2','Type':'Float'},
        {'Name':'x3','Type':'Float'},
        {'Name':'y3','Type':'Float'},
        {'Name':'x4','Type':'Float'},
        {'Name':'y4','Type':'Float'},
    ],
    ONE_ATLAS: [
        {'Name':'num_points','Type':'String'},
        {'Name':'scene_id','Type':'String'}, 
        {'Name':'ds_id','Type':'String'},
        {'Name':'satellite','Type':'String'},
        {'Name':'sensor_mod','Type':'String'},
        {'Name':'cloudsp','Type':'String'},
        {'Name':'sun_azimut','Type':'Float'},
        {'Name':'sun_elevat','Type':'Float'},
        {'Name':'view_angle','Type':'Float'},
        {'Name':'azimuth','Type':'Float'},
        {'Name':'img_start','Type':'Date'},
        {'Name':'order_id','Type':'String'},
        {'Name':'pack_id','Type':'String'},
        {'Name':'qlurl','Type':'String'},
        {'Name':'x1','Type':'Float'},
        {'Name':'y1','Type':'Float'},
        {'Name':'x2','Type':'Float'},
        {'Name':'y2','Type':'Float'},
        {'Name':'x3','Type':'Float'},
        {'Name':'y3','Type':'Float'},
        {'Name':'x4','Type':'Float'},
        {'Name':'y4','Type':'Float'},
        {'Name':'shp_ts','Type':'Date'},
    ],   
    "SPOT-6_7_products": [    
        {'Name':'scene_id','Type':'String'}, 
        {'Name':'ds_id','Type':'String'},
        {'Name':'satellite','Type':'String'},
        {'Name':'sensor_mod','Type':'String'},
        {'Name':'cloudsp','Type':'Integer'},
        {'Name':'sun_azimut','Type':'Float'},
        {'Name':'sun_elevat','Type':'Float'},
        {'Name':'view_angle','Type':'Float'},        
        {'Name':'img_start','Type':'Date'},
        {'Name':'order_id','Type':'String'},
        {'Name':'pack_id','Type':'String'},        
        {'Name':'del_id','Type':'String'},
        {'Name':'com_id','Type':'String'},
        {'Name':'qlurl','Type':'String'},
        {'Name':'x1','Type':'Float'},
        {'Name':'y1','Type':'Float'},
        {'Name':'x2','Type':'Float'},
        {'Name':'y2','Type':'Float'},
        {'Name':'x3','Type':'Float'},
        {'Name':'y3','Type':'Float'},
        {'Name':'x4','Type':'Float'},
        {'Name':'y4','Type':'Float'},        
    ],
    TRIPLESAT: [
        {'Name': 'id', 'Type': 'String'},
        {'Name': 'transform', 'Type': 'String'},
        {'Name': 'satellite', 'Type': 'String'},
        {'Name': 'thumbimg', 'Type': 'String'},
        {'Name': 'rollangle', 'Type': 'Float'},
        {'Name': 'cloudcover', 'Type': 'Float'},
        {'Name': 'wkt', 'Type': 'String'},
        {'Name': 'browserimg', 'Type': 'String'},
        {'Name': 'resolution', 'Type': 'Float'},
        {'Name': 'centertime', 'Type': 'Date'}
    ],
    'Resurs-P': [
        {'Name': 'abstract', 'Type': 'String'},
        {'Name': 'access_open', 'Type': 'Boolean'},
        {'Name': 'access_order', 'Type': 'Boolean'},
        {'Name': 'circuit_number', 'Type': 'Integer'},
        {'Name': 'cloudiness', 'Type': 'Integer'},
        {'Name': 'date_begin', 'Type': 'Date'},
        {'Name': 'date_end', 'Type': 'Date'},
        {'Name': 'date_instant', 'Type': 'Date'},
        {'Name': 'file_identifier', 'Type': 'String'},
        {'Name': 'last_modified', 'Type': 'Date'},
        {'Name': 'metadata_full', 'Type': 'String'},
        {'Name': 'metadata_id', 'Type': 'Integer'},
        {'Name': 'metadata_xml', 'Type': 'String'},
        {'Name': 'order_url', 'Type': 'String'},
        {'Name': 'platform', 'Type': 'String'},
        {'Name': 'platform_id', 'Type': 'Integer'},
        {'Name': 'polygon', 'Type': 'String'},
        {'Name': 'resolution', 'Type': 'Float'},
        {'Name': 'row_count', 'Type': 'Integer'},
        {'Name': 'row_number', 'Type': 'Integer'},
        {'Name': 'scan_number', 'Type': 'Integer'},
        {'Name': 'url', 'Type': 'String'},
        {'Name': 'x1', 'Type': 'Float'},
        {'Name': 'x2', 'Type': 'Float'},
        {'Name': 'x3', 'Type': 'Float'},
        {'Name': 'x4', 'Type': 'Float'},
        {'Name': 'y1', 'Type': 'Float'},
        {'Name': 'y2', 'Type': 'Float'},
        {'Name': 'y3', 'Type': 'Float'},
        {'Name': 'y4', 'Type': 'Float'}
    ],   
    SV1: [
        {'Name': 'mirroroffnadir', 'Type': 'Float'},
        {'Name': 'productlevel', 'Type': 'String'},
        {'Name': 'cloudpercent', 'Type': 'Float'},
        {'Name': 'satelliteid', 'Type': 'String'},
        {'Name': 'bottomrightlatitude', 'Type': 'Float'},
        {'Name': 'orbitid', 'Type': 'Integer'},
        {'Name': 'stripid', 'Type': 'Integer'},
        {'Name': 'sceneid', 'Type': 'Integer'},
        {'Name': 'thumbfilelocation', 'Type': 'String'},
        {'Name': 'centerlongitude', 'Type': 'Float'},
        {'Name': 'toprightlongitude', 'Type': 'Float'},
        {'Name': 'centerlatitude', 'Type': 'Float'},
        {'Name': 'topleftlongitude', 'Type': 'Float'},
        {'Name': 'topleftlatitude', 'Type': 'Float'},
        {'Name': 'toprightlatitude', 'Type': 'Float'},
        {'Name': 'bottomleftlongitude', 'Type': 'Float'},
        {'Name': 'isrelease', 'Type': 'Boolean'},
        {'Name': 'bottomleftlatitude', 'Type': 'Float'},
        {'Name': 'instrumentmodedss', 'Type': 'Float'},
        {'Name': 'browsefilelocation', 'Type': 'String'},
        {'Name': 'scenedate', 'Type': 'Date'},
        {'Name': 'bottomrightlongitude', 'Type': 'Float'},
    ]
};

export default Formats;