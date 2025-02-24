use reqwest::{blocking::Client, header};
use serde_json::{json, Value};
use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[tauri::command]
pub fn greet(name: &str, age: i32) -> String {
    println!("{}, {}", name, age);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn search_grade_api(url: &str, cookie: &str) -> Value {
    let client = Client::new();

    // 创建表单数据
    let mut form_data = HashMap::new();
    form_data.insert("querySetting", json!([{
        "name": "_gotoFirstPage",
        "value": true,
        "linkOpt": "AND",
        "builder": "equal"
    }]).to_string());
    form_data.insert("pageSize", "10".to_string());
    form_data.insert("pageNumber", "1".to_string());

    // 发送同步请求
    let response = client.post(url)
        .header(header::COOKIE, cookie)
        .header(header::CONTENT_TYPE, "application/x-www-form-urlencoded")
        .form(&form_data)
        .send(); // 使用同步 send()

    // 处理响应
    match response {
        Ok(r) => {
            let text = match r.text() {
                Ok(t) => t,
                Err(_) => return json!(ErrorResponse::new(400, "获取数据失败".to_string())),
            };

            // 解析 JSON
            match serde_json::from_str::<ResponseData>(&text) {
                Ok(data) => json!(data),
                Err(_) => json!(ErrorResponse::new(400, "查询失败！JSON解析失败！".to_string())),
            }
        },
        Err(_) => json!(ErrorResponse::new(400, "请求失败！".to_string())), // 请求失败的处理
    }
}


#[derive(Debug, Serialize, Deserialize)]
struct Params {
    url: String,
    cookie: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ResponseData {
    datas: Datas,
    code: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ErrorResponse {
    code: usize,
    msg: String,
}

impl ErrorResponse {
    fn new(code: usize, msg: String) -> Self {
        ErrorResponse { code, msg }
    }
}


#[derive(Debug, Serialize, Deserialize)]
struct Datas {
    xscjcx: Xscjcx,
}

#[derive(Debug, Serialize, Deserialize)]
struct Xscjcx {
    totalSize: u32,
    pageNumber: u32,
    pageSize: u32,
    rows: Vec<Row>, // `rows` 是一个数组
    extParams: ExtParams,
}

#[derive(Debug, Serialize, Deserialize)]
struct Row {
    KSXZDM: Option<String>,
    CJXSZ: Option<String>,
    KCMC: Option<String>,
    XNXQDM: Option<String>,
    KKDWDM: Option<String>,
    SFJG: Option<u8>,
    JDZ: Option<f32>,
    XF: Option<f32>,
    CZRXM: Option<String>,
    KFCXRQ: Option<String>,
    SFJG_DISPLAY: Option<String>,
    KSXZDM_DISPLAY: Option<String>,
    CJFZDM: Option<String>,
    ZTDM: Option<u32>,
    WID: Option<String>,
    XH: Option<String>,
    CZR: Option<String>,
    LRRXM: Option<String>,
    CZSJ: Option<String>,
    DYBFZCJ: Option<f32>,
    XNXQDM_DISPLAY: Option<String>,
    CJ: Option<String>,
    KCLBDM: Option<String>,
    KCLBMC: Option<String>,
    LRSJ: Option<String>,
    DQSFKFCX: Option<u8>,
    KCDM: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ExtParams {
    logId: String,
    code: i32,
    totalPage: u32,
}
