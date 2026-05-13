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
