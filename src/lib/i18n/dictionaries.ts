export type Locale = "en" | "zh";

export const dictionaries = {
  en: {
    nav: {
      home: "Home",
      aboutUs: "About Us",
      services: "Services",
      contact: "Contact",
      logIn: "Log In",
      logOut: "Log out",
      myAccount: "My Account",
      admin: "Admin",
      quote: "Quote",
      catalog: "Catalog",
    },
    hero: {
      title: "B612 Tima Inc",
      subtitle: "Where Logistics Meets Simplicity.",
      description: "Partner with us for efficient, scalable, and cost-effective logistics solutions!",
      cta: "Quote",
    },
    about: {
      tag: "B612 Freight Forwarder",
      title: "US E-commerce\nFulfillment Specialist",
      description:
        "B612 Freight Forwarder is located in Ontario, part of the Greater Los Angeles area, and has a modern e-commerce logistics center of 80,000 square feet. We focus on providing direct-to-consumer fulfillment services for cross-border e-commerce clients, covering major platforms and delivery to end consumers such as Amazon FBA, Tiktok Shop, self-operated sites, Temu, and more.",
      cta: "More About Us",
    },
    serviceCategories: {
      threepl: {
        title: "3PL Logistics Services",
        items: [
          "Inventory management",
          "Order processing",
          "Transportation management and supply chain optimization",
        ],
      },
      transport: {
        title: "Transportation And Logistics",
        items: [
          "Inland transportation services in the United States.",
          "Collaborating with several well-known brands, Anker, Shoparika, and Azalea Wang",
        ],
      },
      overseas: {
        title: "Overseas warehouse service",
        items: [
          "Over 50,000 square feet of modern warehouse facilities.",
          "Located in Los Angeles, offering warehousing, packaging, distribution, and return services.",
        ],
      },
    },
    advantage: {
      title: "B612 Overseas Warehouse\n3PL Advantage",
      flexibility: {
        title: "Warehousing Flexibility",
        description:
          "More flexible services: B612 overseas warehouse provides more flexible logistics solutions, which can be customized according to the specific needs of customers. This means that customers have more control over inventory, order processing, and shipping methods without being restricted by Amazon.",
      },
      logistics: {
        title: "More Logistics Options",
        description:
          "Compared with the traditional transportation policy, B612 overseas warehouse can provide customers with more transportation options, including transportation mode, speed and cost-effectiveness to meet different business needs.",
      },
      customerService: {
        title: "Professional Customer Service",
        description:
          "B612 Overseas Warehouse can provide professional customer service, cooperate with customers, understand their needs, and provide customized solutions. This personalized attention makes the customer experience more satisfying. We can do a 1V1 ratio",
      },
    },
    ourServices: {
      title: "Our Services",
      learnMore: "Learn More",
      cards: [
        { title: "Dropshipping", subtitle: "Ship directly to customer from us," },
        { title: "Warehousing", subtitle: "Warehousing for the Southern California market." },
        { title: "OTR Trucking", subtitle: "From standard LTL/FTL to air and everything in between." },
        { title: "Drayage", subtitle: "Short-haul transportation services at major US ports." },
      ],
    },
    testimonials: {
      title: "Client Testimonials",
      items: [
        {
          quote: "Reliable and fast! Since switching to their fulfillment service, our order accuracy has improved significantly, and shipments go out on time, every time.",
          name: "Jason Lin.",
          role: "Temu Seller",
        },
        {
          quote: "Inventory management is seamless with their WMS system. We never worry about stock discrepancies, and the picking process is incredibly efficient.",
          name: "Emma Chen.",
          role: "Sounor Online Retailer",
        },
        {
          quote: "Great partner for scaling! Their dropshipping service is smooth, and the team is always responsive. Our customers get their orders quickly and without issues.",
          name: "Sophia Smith.",
          role: "Tiktok Seller",
        },
      ],
    },
    footer: {
      businessHours: "Business Hours",
      hours: "Mon - Fri: 9am - 6pm",
      quickLinks: "Quick Links",
      officeChina: "Office in China",
      contact: "Contact",
      copyright: "B612 Tima, Inc. All Rights Reserved.",
    },
    auth: {
      welcomeBack: "Welcome back!",
      signInDesc: "Sign in to access your account and manage warehouse orders.",
      email: "Email",
      password: "Password",
      signIn: "Sign in",
      needAccount: "Need an account?",
      createAccount: "Create customer account",
      createAccountTitle: "Create customer account",
      createAccountDesc: "For warehouse service orders and payments. Admin accounts are provisioned separately.",
      fullName: "Full name",
      company: "Company",
      optional: "(optional)",
      workEmail: "Work email",
      passwordMin: "(min 8 characters)",
      createBtn: "Create account",
      alreadyHaveAccount: "Already have an account?",
      signInLink: "Sign in",
      sessionExpired: "Your session expired. Please sign in again.",
    },
    catalog: {
      title: "Services & products",
      description: "Pick quantities below, then place an order or request a quote. Payment always happens on your payment provider's hosted pages after we issue an invoice — never by entering a card here.",
      myAccount: "My account",
    },
    portal: {
      title: "My account",
      recentOrders: "Recent orders",
      invoices: "Invoices",
      noOrders: "No orders yet. Start from the catalog.",
      noInvoices: "No invoices yet.",
      view: "View",
      open: "Open",
    },
    admin: {
      dashboard: "Admin dashboard",
      dashboardDesc: "Manage catalog, customers, orders, invoices, and payments.",
      orders: "Orders",
      products: "Products",
      invoices: "Invoices",
      customers: "Customers",
      payments: "Payments",
    },
    aboutPage: {
      title: "About Us",
      subtitle: "A Fulfillment Logistics Company",
      intro: "B612 Tima Inc also calls B612 Freight Forwarder.",
      description1: "Utilizing our proprietary performance analytics, we work with customers to deliver reliable solutions for all of your complex pick, pack, ship operations.",
      description2: "B612 Freight Forwarder is currently warehousing an Import facility in Ontario, CA, total of 80,000 Sqft. B612 provides worry-free support to global trading clients while B612 collaborates with businesses to create strategies for maximum performance, eliminating obstacles and waste. B612 use productivity measurements for improved utilization of labor and resources.",
      description3: "B612 Freight Forwarder has been supporting many of the largest retail and e-commerce businesses in the country, holding the service accountable to the highest standards and fulfilling the desired outcomes of our clients.",
      endToEnd: {
        title: "Comprehensive End-to-End Logistics Solutions",
        description: "We provide a seamless logistics experience from Order Booking to Delivery Proof, ensuring efficiency and reliability at every step. Our digital platform simplifies order management, while secure Warehousing offers optimized storage. Smart Dispatch & Routing minimizes delays, and verified Delivery Proof guarantees transparency. With real-time tracking and 24/7 support, we deliver cost-effective, scalable solutions tailored to your business needs.",
      },
      workflow: {
        title: "Workflow Automation",
        description: "Through intelligent automation to reconstruct the full-link management of freight, our solution integrates AI scheduling algorithms, real-time cargo tracking and intelligent document processing systems to help logistics companies reduce labor costs by 30%, improve order processing efficiency by 45%, and achieve seamless digital collaboration from warehousing to delivery.",
      },
      steps: [
        { title: "Order Booking", description: "We streamline your order booking process with seamless digital integration. Our platform allows real-time order entry, instant confirmation, and automated documentation. Customers can track status updates, while our team ensures accuracy and efficiency." },
        { title: "Dispatch & Routing", description: "Efficient dispatch and intelligent routing minimize delays and fuel costs. Our dynamic route optimization software adjusts for traffic, weather, and delivery windows. Real-time GPS tracking ensures transparency, while automated alerts keep stakeholders informed." },
        { title: "Warehousing", description: "Our secure warehousing solutions offer optimized storage, inventory management, and cross-docking services. Equipped with climate control and advanced tracking, we ensure safe handling of goods. Real-time stock visibility and flexible space allocation enhance efficiency." },
        { title: "Delivery Proof", description: "We provide digital proof of delivery (POD) with timestamped signatures, photos, and GPS verification. Our system generates instant notifications and automated reports for full transparency. This ensures accountability, reduces disputes, and enhances customer trust." },
      ],
      costSection: {
        title: "Know Where Every Dollar Goes",
        subtitle: "Every fee explained. Every dollar maximized for your success",
        cta: "Get a Free Quote",
      },
      costFeatures: [
        { title: "End-to-end cost tracking", description: "The historical bill comparison function helps enterprises identify hidden price increase channels within 3 years, and the accuracy rate of overspending risk warning is 98%." },
        { title: "Dynamic cost sandbox", description: "Based on the attributes of the goods (weight/volume/category) and timeliness requirements, the capital efficiency of different transportation combinations is automatically calculated." },
        { title: "Smart bargaining cockpit", description: "It has helped electronic accessories customers accurately anchor 13 optimizeable terms in the annual contract negotiations, driving a further 8.5% reduction in transportation costs." },
        { title: "Funding dashboard", description: "From the completion of the receipt to the tariff deduction of the whole cycle of capital flow modeling, the real profit rate of a single shipment is automatically calculated." },
      ],
      faqTitle: "FAQ",
      faqs: [
        { q: "Where are your warehouses located? Is it possible to visit the site?", a: "Our warehouse is located in Los Angeles, California, close to major ports and airports. Customers can make an appointment to visit in advance, and we welcome on-site visits." },
        { q: "What platforms do you support for order processing?", a: "We support order processing on platforms including Amazon, eBay, Walmart, Shopify, TikTok, Temu, etc., as well as independent stations and custom system docking." },
        { q: "What services does the overseas warehouse provide?", a: "We offer the following services:\n• Warehousing (per pallet/cubic meter/piece)\n• Dropshipping (single piece picking, labeling, packing and shipping)\n• B2B/B2C order fulfillment\n• FBA return transfer, labeling and relabeling\n• Repackaging, quality inspection, reinforcement services\n• LTL/FTL card delivery" },
        { q: "How long does it take to ship?", a: "• Local delivery (CA, NV, AZ, etc.): 1-2 working days\n• Standard Express Delivery: 2-5 business days\n• Special timeliness services such as expedited can be customized" },
        { q: "How do I connect to the system? Is the API supported?", a: "We support API docking, and we can also synchronize orders through ERP systems (such as ShipStation, ShipHero, CJ Dropshipping, etc.). Excel import is also available." },
        { q: "Is there a minimum order quantity or warehousing requirement?", a: "We have no mandatory MOQ requirements, which is suitable for small and medium-sized sellers or start-up brands. Storage fees can be billed on demand, which is flexible and elastic." },
        { q: "How will I be billed? What are the charges?", a: "Common fees include:\n• Storage fee (per day/pallet/cubic meter/piece)\n• Picking fee\n• Packing fee (optional to bring your own packaging)\n• Outbound fees\n• Additional services such as label fees, label replacement fees, etc\nWe will provide a detailed quotation form." },
        { q: "Can I assist with customs clearance/final mileage?", a: "We work with a number of customs clearance and last-mile delivery companies to assist customers with door-to-door services, including truck, express, LTL and other shipping methods." },
      ],
    },
  },

  zh: {
    nav: {
      home: "首页",
      aboutUs: "关于我们",
      services: "服务",
      contact: "联系我们",
      logIn: "登录",
      logOut: "退出",
      myAccount: "我的账户",
      admin: "管理",
      quote: "报价",
      catalog: "产品目录",
    },
    hero: {
      title: "B612 Tima Inc",
      subtitle: "物流，简而不凡。",
      description: "与我们合作，获取高效、可扩展且经济实惠的物流解决方案！",
      cta: "获取报价",
    },
    about: {
      tag: "B612 货运代理",
      title: "美国电商\n履约专家",
      description:
        "B612 货运代理位于大洛杉矶地区的安大略市，拥有80,000平方英尺的现代电商物流中心。我们专注于为跨境电商客户提供直接面向消费者的履约服务，涵盖Amazon FBA、TikTok Shop、自营站点、Temu等主要平台的配送服务。",
      cta: "了解更多",
    },
    serviceCategories: {
      threepl: {
        title: "第三方物流服务",
        items: ["库存管理", "订单处理", "运输管理和供应链优化"],
      },
      transport: {
        title: "运输与物流",
        items: [
          "美国境内内陆运输服务。",
          "与多个知名品牌合作，包括Anker、Shoparika和Azalea Wang",
        ],
      },
      overseas: {
        title: "海外仓服务",
        items: [
          "超过50,000平方英尺的现代仓储设施。",
          "位于洛杉矶，提供仓储、包装、分销和退货服务。",
        ],
      },
    },
    advantage: {
      title: "B612 海外仓\n3PL 优势",
      flexibility: {
        title: "仓储灵活性",
        description:
          "更灵活的服务：B612海外仓提供更灵活的物流解决方案，可根据客户的具体需求进行定制。这意味着客户对库存、订单处理和运输方式有更多的控制权，不受亚马逊的限制。",
      },
      logistics: {
        title: "更多物流选择",
        description:
          "与传统运输政策相比，B612海外仓可以为客户提供更多的运输选择，包括运输方式、速度和成本效益，以满足不同的业务需求。",
      },
      customerService: {
        title: "专业客户服务",
        description:
          "B612海外仓可以提供专业的客户服务，与客户合作，了解他们的需求，提供定制化解决方案。这种个性化的关注使客户体验更加满意。我们可以做到1对1的比例。",
      },
    },
    ourServices: {
      title: "我们的服务",
      learnMore: "了解更多",
      cards: [
        { title: "代发货", subtitle: "直接从我们这里发货给客户，" },
        { title: "仓储", subtitle: "南加州市场的仓储业务。" },
        { title: "OTR 卡车运输", subtitle: "从标准 LTL/FTL 到空运以及介于两者之间的一切。" },
        { title: "拖运", subtitle: "美国主要港口的短途运输服务。" },
      ],
    },
    testimonials: {
      title: "客户评价",
      items: [
        {
          quote: "可靠且快速！自从转用他们的履约服务后，我们的订单准确率显著提高，发货总是准时的。",
          name: "Jason Lin.",
          role: "Temu 卖家",
        },
        {
          quote: "库存管理与WMS系统无缝对接。我们再也不用担心库存差异，拣货过程非常高效。",
          name: "Emma Chen.",
          role: "Sounor 在线零售商",
        },
        {
          quote: "扩展业务的好伙伴！他们的代发货服务非常顺畅，团队总是积极响应。我们的客户能快速无忧地收到订单。",
          name: "Sophia Smith.",
          role: "TikTok 卖家",
        },
      ],
    },
    footer: {
      businessHours: "营业时间",
      hours: "周一至周五：上午9点 - 下午6点",
      quickLinks: "快速链接",
      officeChina: "中国办公室",
      contact: "联系方式",
      copyright: "B612 Tima, Inc. 版权所有。",
    },
    auth: {
      welcomeBack: "欢迎回来！",
      signInDesc: "登录您的账户以管理仓库订单。",
      email: "邮箱",
      password: "密码",
      signIn: "登录",
      needAccount: "还没有账户？",
      createAccount: "创建客户账户",
      createAccountTitle: "创建客户账户",
      createAccountDesc: "用于仓储服务订单和支付。管理员账户需单独开设。",
      fullName: "姓名",
      company: "公司",
      optional: "（可选）",
      workEmail: "工作邮箱",
      passwordMin: "（至少8个字符）",
      createBtn: "创建账户",
      alreadyHaveAccount: "已有账户？",
      signInLink: "登录",
      sessionExpired: "您的会话已过期，请重新登录。",
    },
    catalog: {
      title: "服务和产品",
      description: "选择下方数量，然后下单或请求报价。付款始终在我们开具发票后在您的支付提供商的托管页面上进行——无需在此处输入银行卡信息。",
      myAccount: "我的账户",
    },
    portal: {
      title: "我的账户",
      recentOrders: "最近订单",
      invoices: "发票",
      noOrders: "暂无订单。请从产品目录开始。",
      noInvoices: "暂无发票。",
      view: "查看",
      open: "打开",
    },
    admin: {
      dashboard: "管理面板",
      dashboardDesc: "管理产品目录、客户、订单、发票和付款。",
      orders: "订单",
      products: "产品",
      invoices: "发票",
      customers: "客户",
      payments: "付款",
    },
    aboutPage: {
      title: "关于我们",
      subtitle: "一家履约物流公司",
      intro: "B612 Tima Inc 又称 B612 货运代理。",
      description1: "利用我们专有的绩效分析，我们与客户合作，为您所有复杂的拣货、包装、发货操作提供可靠的解决方案。",
      description2: "B612 货运代理目前在加州安大略市运营一个进口仓储设施，总面积80,000平方英尺。B612为全球贸易客户提供无忧支持，与企业合作制定最大化绩效策略，消除障碍和浪费。B612使用生产力指标来提高劳动力和资源的利用率。",
      description3: "B612 货运代理一直在支持全国许多大型零售和电商企业，以最高标准提供服务，实现客户的预期目标。",
      endToEnd: {
        title: "全面的端到端物流解决方案",
        description: "我们提供从订单预约到交付证明的无缝物流体验，确保每个环节的效率和可靠性。我们的数字平台简化订单管理，安全的仓储提供优化存储。智能调度和路线规划减少延误，经过验证的交付证明保证透明度。通过实时跟踪和24/7支持，我们提供量身定制的经济高效、可扩展的解决方案。",
      },
      workflow: {
        title: "工作流自动化",
        description: "通过智能自动化重构货运全链路管理，我们的解决方案集成AI调度算法、实时货物跟踪和智能文档处理系统，帮助物流公司降低30%的人工成本，提高45%的订单处理效率，实现从仓储到交付的无缝数字化协作。",
      },
      steps: [
        { title: "订单预约", description: "我们通过无缝数字集成简化您的订单预约流程。我们的平台允许实时订单录入、即时确认和自动化文档处理。客户可以跟踪状态更新，我们的团队确保准确性和效率。" },
        { title: "调度与路线", description: "高效的调度和智能路线规划减少延误和燃油成本。我们的动态路线优化软件可根据交通、天气和交付窗口进行调整。实时GPS跟踪确保透明度，自动警报让利益相关者随时了解情况。" },
        { title: "仓储", description: "我们安全的仓储解决方案提供优化的存储、库存管理和越库服务。配备温控和先进追踪，确保货物安全处理。实时库存可视性和灵活的空间分配提高效率。" },
        { title: "交付证明", description: "我们提供带有时间戳签名、照片和GPS验证的数字交付证明(POD)。我们的系统生成即时通知和自动化报告，实现完全透明。确保问责制，减少争议，增强客户信任。" },
      ],
      costSection: {
        title: "清楚每一分钱的去向",
        subtitle: "每笔费用都有说明。每一美元都为您的成功最大化",
        cta: "获取免费报价",
      },
      costFeatures: [
        { title: "端到端成本追踪", description: "历史账单对比功能帮助企业在3年内识别隐藏的价格上涨渠道，超支风险预警准确率达98%。" },
        { title: "动态成本沙盒", description: "基于货物属性（重量/体积/类别）和时效要求，自动计算不同运输组合的资金效率。" },
        { title: "智能议价驾驶舱", description: "已帮助电子配件客户在年度合同谈判中精准锚定13个可优化条款，推动运输成本进一步降低8.5%。" },
        { title: "资金仪表板", description: "从收货完成到关税扣除的全周期资金流建模，自动计算单票实际利润率。" },
      ],
      faqTitle: "常见问题",
      faqs: [
        { q: "你们的仓库在哪里？可以参观吗？", a: "我们的仓库位于加州洛杉矶，靠近主要港口和机场。客户可以提前预约参观，我们欢迎现场访问。" },
        { q: "你们支持哪些平台的订单处理？", a: "我们支持Amazon、eBay、Walmart、Shopify、TikTok、Temu等平台的订单处理，也支持独立站和自定义系统对接。" },
        { q: "海外仓提供哪些服务？", a: "我们提供以下服务：\n• 仓储（按托盘/立方米/件计费）\n• 代发货（单件拣货、贴标、包装和发货）\n• B2B/B2C订单履约\n• FBA退货转运、贴标和换标\n• 重新包装、质检、加固服务\n• LTL/FTL卡车运输" },
        { q: "发货需要多长时间？", a: "• 本地配送（CA、NV、AZ等）：1-2个工作日\n• 标准快递：2-5个工作日\n• 特殊时效服务如加急可定制" },
        { q: "如何接入系统？支持API吗？", a: "我们支持API对接，也可以通过ERP系统（如ShipStation、ShipHero、CJ Dropshipping等）同步订单。也支持Excel导入。" },
        { q: "有最低订单量或仓储要求吗？", a: "我们没有强制最低订单量要求，适合中小型卖家或初创品牌。仓储费可按需计费，灵活弹性。" },
        { q: "如何计费？费用是多少？", a: "常见费用包括：\n• 仓储费（按天/托盘/立方米/件）\n• 拣货费\n• 包装费（可选自带包装）\n• 出库费\n• 附加服务如贴标费、换标费等\n我们会提供详细的报价单。" },
        { q: "可以协助清关/尾程吗？", a: "我们与多家清关和尾程配送公司合作，协助客户提供门到门服务，包括卡车、快递、LTL等多种运输方式。" },
      ],
    },
  },
} as const;

type DeepStringify<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly (infer U)[]
      ? U extends string
        ? readonly string[]
        : readonly DeepStringify<U>[]
      : DeepStringify<T[K]>;
};

export type Dictionary = DeepStringify<(typeof dictionaries)["en"]>;
