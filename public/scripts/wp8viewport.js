/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 30/06/13
 * Time: 14:02
 * To change this template use File | Settings | File Templates.
 */
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(
    document.createTextNode(
    "@-ms-viewport{width:auto!important}"
)
);
document.getElementsByTagName("head")[0].
appendChild(msViewportStyle);
}
