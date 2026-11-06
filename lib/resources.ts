export type Resource = { title: string; category: string; type: string; description: string; url: string; source: string; };
export const resources: Resource[] = [
 {title:'PnP Power Platform Samples',category:'Power Apps',type:'Samples',description:'Community-built Power Apps, flows, and Power Pages solutions.',url:'https://github.com/pnp/powerplatform-samples',source:'Microsoft 365 & Power Platform Community'},
 {title:'Microsoft Power Apps Samples',category:'Power Apps',type:'Code',description:'Dataverse, model-driven apps, PCF and custom connector examples.',url:'https://github.com/microsoft/PowerApps-Samples',source:'Microsoft'},
 {title:'Power Fx Reference',category:'Power Apps',type:'Documentation',description:'Functions, expressions, formulas, and language reference.',url:'https://learn.microsoft.com/en-us/power-platform/power-fx/overview',source:'Microsoft Learn'},
 {title:'Power Automate Documentation',category:'Power Automate',type:'How-to',description:'Cloud flows, expressions, approvals and automation tutorials.',url:'https://learn.microsoft.com/en-us/power-automate/',source:'Microsoft Learn'},
 {title:'Dataverse Developer Guide',category:'Dataverse',type:'Documentation',description:'Dataverse APIs, plugins, security and development patterns.',url:'https://learn.microsoft.com/en-us/power-apps/developer/data-platform/',source:'Microsoft Learn'},
 {title:'Power Pages Documentation',category:'Power Pages',type:'How-to',description:'Build secure external-facing sites with Power Pages.',url:'https://learn.microsoft.com/en-us/power-pages/',source:'Microsoft Learn'},
 {title:'Power BI Documentation',category:'Power BI',type:'Documentation',description:'DAX, data modeling, Power Query and analytics guidance.',url:'https://learn.microsoft.com/en-us/power-bi/',source:'Microsoft Learn'},
 {title:'Copilot Studio Documentation',category:'Copilot Studio',type:'Documentation',description:'Create and manage conversational agents.',url:'https://learn.microsoft.com/en-us/microsoft-copilot-studio/',source:'Microsoft Learn'},
 {title:'PnP Script Samples',category:'Administration',type:'Scripts',description:'PowerShell and Microsoft 365 administration scripts.',url:'https://github.com/pnp/script-samples',source:'Microsoft 365 & Power Platform Community'},
 {title:'Power Platform CLI',category:'Administration',type:'Tooling',description:'Official command-line tooling for Power Platform development.',url:'https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction',source:'Microsoft Learn'}
];
export const categories = ['All','Power Apps','Power Automate','Dataverse','Power Pages','Power BI','Copilot Studio','Administration'];
