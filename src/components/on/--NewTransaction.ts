import NewTransaction from "@/components/on/NewTransaction.vue"
import { createApp } from "vue";

export default () => {
    const mount_div = document.createElement("div")
    document.getElementById("app")?.appendChild(mount_div)

    const newtransaction_app = createApp(NewTransaction, {
        // PROPS HERE
    })
    newtransaction_app.mount(mount_div)

    // setTimeout(() => {
    //     newtransaction_app.unmount()
    //     mount_div.remove()
    // }, 2000)
}