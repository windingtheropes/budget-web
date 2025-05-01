import ToastAlert from "@/components/ToastAlert.vue"
import { createApp } from "vue";

export default (message: string, color: string) => {
    const toast_id = Math.random();
    const mount_div = document.createElement("div")
    mount_div.setAttribute("id", toast_id.toString())
    document.getElementById("app")?.appendChild(mount_div)

    const toast_app = createApp(ToastAlert, {
        message, color
    })
    toast_app.mount(mount_div)

    setTimeout(() => {
        toast_app.unmount()
        mount_div.remove()
    }, 2000)
}