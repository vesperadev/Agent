// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//
// 站 1 最小链路：前端把消息传进来，这里先确认消息已端到端送达，
// 直接回 `收到消息：<原文>`。真实 LLM 调用会在后续步骤接进这里。
#[tauri::command]
fn chat(message: String) -> String {
    format!("收到消息：{}", message)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![chat])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
