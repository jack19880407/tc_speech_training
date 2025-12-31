const emperors = [
    {
        name: '朱元璋',
        title: '明太祖',
        era: '洪武',
        reign: '1368 - 1398',
        duration: '30年',
        achievements: ['建立明朝', '推翻元朝', '恢复汉族政权', '制定《大明律》'],
        details: `
            <p>朱元璋，明太祖，明朝开国皇帝。出身贫农，曾为乞丐和僧人，后参加红巾军起义。1368年攻克大都（今北京），推翻元朝统治，建立明朝。</p>
            <div class="event-item">
                <div class="event-year">1368年</div>
                <div>朱元璋在应天府（今南京）称帝，国号大明，年号洪武</div>
            </div>
            <div class="event-item">
                <div class="event-year">1370年</div>
                <div>分封诸王，加强中央集权</div>
            </div>
            <div class="event-item">
                <div class="event-year">1380年</div>
                <div>废除丞相制度，皇权高度集中</div>
            </div>
            <p>洪武帝推行休养生息政策，恢复社会经济，制定《大明律》，建立完整的官僚体系，为明朝的统治奠定了基础。</p>
        `
    },
    {
        name: '朱允炆',
        title: '明惠宗',
        era: '建文',
        reign: '1398 - 1402',
        duration: '4年',
        achievements: ['削藩政策', '文治改革'],
        details: `
            <p>朱允炆，明惠宗，朱元璋之孙。在位期间推行削藩政策，试图削弱诸王势力，引发靖难之役。</p>
            <div class="event-item">
                <div class="event-year">1398年</div>
                <div>继位为帝，年号建文</div>
            </div>
            <div class="event-item">
                <div class="event-year">1399年</div>
                <div>开始削藩，引发燕王朱棣起兵</div>
            </div>
            <div class="event-item">
                <div class="event-year">1402年</div>
                <div>南京城破，下落不明</div>
            </div>
            <p>建文帝在位期间推行文治，宽政省刑，但其削藩政策激化了与燕王朱棣的矛盾，最终导致靖难之役，江山易主。</p>
        `
    },
    {
        name: '朱棣',
        title: '明成祖',
        era: '永乐',
        reign: '1402 - 1424',
        duration: '22年',
        achievements: ['靖难之役', '迁都北京', '编纂《永乐大典》', '郑和下西洋'],
        details: `
            <p>朱棣，明成祖，朱元璋第四子。通过靖难之役夺取皇位，是明朝最有作为的皇帝之一。</p>
            <div class="event-item">
                <div class="event-year">1402年</div>
                <div>攻占南京，登基为帝，年号永乐</div>
            </div>
            <div class="event-item">
                <div class="event-year">1405年</div>
                <div>郑和首次下西洋，开启七次远航</div>
            </div>
            <div class="event-item">
                <div class="event-year">1421年</div>
                <div>迁都北京，南京为陪都</div>
            </div>
            <div class="event-item">
                <div class="event-year">1424年</div>
                <div>《永乐大典》编纂完成</div>
            </div>
            <p>永乐帝雄才大略，迁都北京，营建紫禁城，派遣郑和七下西洋，编纂《永乐大典》，开创了明朝的盛世局面。</p>
        `
    },
    {
        name: '朱高炽',
        title: '明仁宗',
        era: '洪熙',
        reign: '1424 - 1425',
        duration: '1年',
        achievements: ['停止郑和远航', '休养生息', '减免赋税'],
        details: `
            <p>朱高炽，明仁宗，朱棣长子。在位时间短暂，但实施仁政，为仁宣之治奠定基础。</p>
            <div class="event-item">
                <div class="event-year">1424年</div>
                <div>继位为帝，年号洪熙</div>
            </div>
            <div class="event-item">
                <div class="event-year">1425年</div>
                <div>停止郑和下西洋，专注内政</div>
            </div>
            <p>仁宗性格温和，在位期间停止大规模对外征伐，推行休养生息政策，减免赋税，缓和了永乐末年的紧张局面。</p>
        `
    },
    {
        name: '朱瞻基',
        title: '明宣宗',
        era: '宣德',
        reign: '1425 - 1435',
        duration: '10年',
        achievements: ['仁宣之治', '平定叛乱', '发展文化艺术'],
        details: `
            <p>朱瞻基，明宣宗，朱高炽长子。在位期间国家安定，经济发展，文化艺术繁荣，史称"仁宣之治"。</p>
            <div class="event-item">
                <div class="event-year">1425年</div>
                <div>继位为帝，年号宣德</div>
            </div>
            <div class="event-item">
                <div class="event-year">1426年</div>
                <div>平定汉王朱高煦叛乱</div>
            </div>
            <div class="event-item">
                <div class="event-year">1430年</div>
                <div>派遣郑和第七次下西洋</div>
            </div>
            <p>宣宗文武双全，在位期间政治清明，经济繁荣，文化艺术达到新高度。本人也是出色的画家和书法家，宣德炉更是传世珍品。</p>
        `
    },
    {
        name: '朱祁镇',
        title: '明英宗',
        era: '正统/天顺',
        reign: '1435 - 1449, 1457 - 1464',
        duration: '22年',
        achievements: ['土木堡之变', '夺门之变', '两度为帝'],
        details: `
            <p>朱祁镇，明英宗，朱瞻基长子。明朝唯一一位两次即位的皇帝，经历了土木堡之变和夺门之变。</p>
            <div class="event-item">
                <div class="event-year">1435年</div>
                <div>继位为帝，年号正统</div>
            </div>
            <div class="event-item">
                <div class="event-year">1449年</div>
                <div>土木堡之变被瓦剌俘虏</div>
            </div>
            <div class="event-item">
                <div class="event-year">1457年</div>
                <div>夺门之变复辟，改元天顺</div>
            </div>
            <p>英宗幼年继位，宠信宦官王振，导致土木堡之变，被瓦剌俘虏。后通过夺门之变重登皇位，杀害忠臣于谦，但晚年有所悔悟。</p>
        `
    },
    {
        name: '朱祁钰',
        title: '明代宗',
        era: '景泰',
        reign: '1449 - 1457',
        duration: '8年',
        achievements: ['北京保卫战', '励精图治'],
        details: `
            <p>朱祁钰，明代宗，朱祁镇之弟。在土木堡之变后即位，组织北京保卫战，稳定了明朝的统治。</p>
            <div class="event-item">
                <div class="event-year">1449年</div>
                <div>土木堡之变后即位，年号景泰</div>
            </div>
            <div class="event-item">
                <div class="event-year">1449年</div>
                <div>任用于谦组织北京保卫战</div>
            </div>
            <div class="event-item">
                <div class="event-year">1450年</div>
                <div>瓦剌释放英宗</div>
            </div>
            <p>景泰帝在位期间任用于谦等人，成功抵御瓦剌入侵，保卫了北京。虽治国有所作为，但最终在夺门之变中被废黜。</p>
        `
    },
    {
        name: '朱见深',
        title: '明宪宗',
        era: '成化',
        reign: '1464 - 1487',
        duration: '23年',
        achievements: ['成化新政', '西南统一', '成化斗彩'],
        details: `
            <p>朱见深，明宪宗，朱祁镇之子。在位期间成化斗彩瓷器达到艺术高峰，但宠信万贵妃，朝政逐渐腐败。</p>
            <div class="event-item">
                <div class="event-year">1464年</div>
                <div>继位为帝，年号成化</div>
            </div>
            <div class="event-item">
                <div class="event-year">1473年</div>
                <div>平定西南叛乱，巩固边疆</div>
            </div>
            <div class="event-item">
                <div class="event-year">1479年</div>
                <div>设立西厂，特务政治加剧</div>
            </div>
            <p>宪宗在位初期有所作为，平定叛乱，巩固边疆。成化年间瓷器工艺达到巅峰，成化斗彩传世稀少。但后期宠信万贵妃，设立西厂，朝政日趋腐败。</p>
        `
    },
    {
        name: '朱佑樘',
        title: '明孝宗',
        era: '弘治',
        reign: '1487 - 1505',
        duration: '18年',
        achievements: ['弘治中兴', '勤政爱民', '一夫一妻'],
        details: `
            <p>朱佑樘，明孝宗，朱见深之子。明朝最贤明的皇帝之一，开创"弘治中兴"，是唯一实行一夫一妻制的皇帝。</p>
            <div class="event-item">
                <div class="event-year">1487年</div>
                <div>继位为帝，年号弘治</div>
            </div>
            <div class="event-item">
                <div class="event-year">1488年</div>
                <div>驱逐奸佞，任用贤臣</div>
            </div>
            <div class="event-item">
                <div class="event-year">1490年代</div>
                <div>推行勤政爱民政策，经济恢复</div>
            </div>
            <p>孝宗勤政爱民，任用贤臣，驱逐奸佞，使明朝政治重新清明。他一生只有张皇后一位妻子，在帝王中极为罕见。弘治年间社会经济繁荣，史称"弘治中兴"。</p>
        `
    },
    {
        name: '朱厚照',
        title: '明武宗',
        era: '正德',
        reign: '1505 - 1521',
        duration: '16年',
        achievements: ['自封威武大将军', '应州大捷', '王阳明平叛'],
        details: `
            <p>朱厚照，明武宗，朱佑樘之子。性格豪放不羁，喜欢游乐，但在应州之战中击败蒙古，支持王阳明平定宁王之乱。</p>
            <div class="event-item">
                <div class="event-year">1505年</div>
                <div>继位为帝，年号正德</div>
            </div>
            <div class="event-item">
                <div class="event-year">1517年</div>
                <div>应州大捷，亲自率军击败蒙古</div>
            </div>
            <div class="event-item">
                <div class="event-year">1519年</div>
                <div>王阳明平定宁王之乱</div>
            </div>
            <p>武宗虽被传统史书批评为荒淫，但实际上文武双全。自封"威武大将军朱寿"，亲自率军作战，在应州击败蒙古。其统治期间文化思想活跃，王阳明心学开始传播。</p>
        `
    },
    {
        name: '朱厚熜',
        title: '明世宗',
        era: '嘉靖',
        reign: '1521 - 1567',
        duration: '45年',
        achievements: ['大礼议', '南倭北虏', '严嵩专权', '壬寅宫变'],
        details: `
            <p>朱厚熜，明世宗，兴献王之子，过继给武宗。在位45年，是明朝在位时间最长的皇帝之一。</p>
            <div class="event-item">
                <div class="event-year">1521年</div>
                <div>入继大统，年号嘉靖</div>
            </div>
            <div class="event-item">
                <div class="event-year">1524年</div>
                <div>大礼议，加强皇权</div>
            </div>
            <div class="event-item">
                <div class="event-year">1542年</div>
                <div>壬寅宫变，被宫女刺杀未遂</div>
            </div>
            <div class="event-item">
                <div class="event-year">1550年代</div>
                <div>东南沿海倭寇猖獗，戚继光抗倭</div>
            </div>
            <p>嘉靖帝早年英明，后期沉迷道教，宠信严嵩。面临"南倭北虏"的困境，戚继光、俞大猷等名将抗倭有功。嘉靖年间资本主义萌芽开始在江南地区出现。</p>
        `
    },
    {
        name: '朱载坖',
        title: '明穆宗',
        era: '隆庆',
        reign: '1567 - 1572',
        duration: '6年',
        achievements: ['隆庆开关', '俺答封贡', '改革赋税'],
        details: `
            <p>朱载坖，明穆宗，朱厚熜第三子。在位期间开放海禁，缓和与蒙古的关系，为万历中兴奠定了基础。</p>
            <div class="event-item">
                <div class="event-year">1567年</div>
                <div>继位为帝，年号隆庆</div>
            </div>
            <div class="event-item">
                <div class="event-year">1567年</div>
                <div>隆庆开关，解除海禁</div>
            </div>
            <div class="event-item">
                <div class="event-year">1570年</div>
                <div>俺答封贡，与蒙古达成和议</div>
            </div>
            <div class="event-item">
                <div class="event-year">1571年</div>
                <div>改革赋税，推行"一条鞭法"</div>
            </div>
            <p>穆宗虽在位时间不长，但推行了一系列重要改革。隆庆开关促进了海外贸易，俺答封贡缓和了北方边境危机，赋税改革为万历中兴奠定了基础。</p>
        `
    },
    {
        name: '朱翊钧',
        title: '明神宗',
        era: '万历',
        reign: '1572 - 1620',
        duration: '48年',
        achievements: ['万历中兴', '万历三大征', '援朝抗日', '三十年不上朝'],
        details: `
            <p>朱翊钧，明神宗，朱厚熜之孙。在位48年，是明朝在位时间最长的皇帝，晚期长期不上朝。</p>
            <div class="event-item">
                <div class="event-year">1572年</div>
                <div>继位为帝，年号万历</div>
            </div>
            <div class="event-item">
                <div class="event-year">1572-1582年</div>
                <div>张居正改革，万历中兴</div>
            </div>
            <div class="event-item">
                <div class="event-year">1592-1598年</div>
                <div>万历三大征，包括援朝抗日</div>
            </div>
            <div class="event-item">
                <div class="event-year">1600年</div>
                <div>利玛窦来华，西学东渐</div>
            </div>
            <p>万历朝初期张居正改革，国力强盛。万历三大征巩固了边疆，援朝抗日击败丰臣秀吉。但晚期神宗长期不上朝，朝政荒废，为明朝灭亡埋下伏笔。</p>
        `
    },
    {
        name: '朱常洛',
        title: '明光宗',
        era: '泰昌',
        reign: '1620',
        duration: '1个月',
        achievements: ['废除矿税', '泰昌新政'],
        details: `
            <p>朱常洛，明光宗，朱翊钧长子。在位仅一个月，是中国历史上在位时间最短的皇帝之一。</p>
            <div class="event-item">
                <div class="event-year">1620年</div>
                <div>继位为帝，年号泰昌</div>
            </div>
            <div class="event-item">
                <div class="event-year">1620年</div>
                <div>废除矿税，减轻民众负担</div>
            </div>
            <div class="event-item">
                <div class="event-year">1620年</div>
                <div>红丸案，暴病而亡</div>
            </div>
            <p>光宗虽在位短暂，但即位后立即废除矿税等弊政，深得民心。可惜服用"红丸"后暴病而亡，在位仅29天，史称"一月天子"。</p>
        `
    },
    {
        name: '朱由校',
        title: '明熹宗',
        era: '天启',
        reign: '1620 - 1627',
        duration: '7年',
        achievements: ['魏忠贤专权', '东林党争', '木工皇帝'],
        details: `
            <p>朱由校，明熹宗，朱常洛长子。酷爱木工，不理朝政，导致魏忠贤专权，东林党争激烈。</p>
            <div class="event-item">
                <div class="event-year">1620年</div>
                <div>继位为帝，年号天启</div>
            </div>
            <div class="event-item">
                <div class="event-year">1620年代</div>
                <div>魏忠贤专权，迫害东林党</div>
            </div>
            <div class="event-item">
                <div class="event-year">1626年</div>
                <div>后金攻占宁远，袁崇焕击退</div>
            </div>
            <p>熹宗痴迷木工，技艺精湛，被称为"木工皇帝"。不理朝政，大权旁落宦官魏忠贤之手，东林党人遭到残酷迫害，政治黑暗，国力衰退。</p>
        `
    },
    {
        name: '朱由检',
        title: '明思宗',
        era: '崇祯',
        reign: '1627 - 1644',
        duration: '17年',
        achievements: ['铲除魏忠贤', '勤政图治', '煤山自缢'],
        details: `
            <p>朱由检，明思宗，朱由校之弟。明朝最后一位皇帝，试图挽救明朝但最终失败，在煤山自缢殉国。</p>
            <div class="event-item">
                <div class="event-year">1627年</div>
                <div>继位为帝，年号崇祯</div>
            </div>
            <div class="event-item">
                <div class="event-year">1628年</div>
                <div>铲除魏忠贤，清算阉党</div>
            </div>
            <div class="event-item">
                <div class="event-year">1628-1644年</div>
                <div>李自成、张献忠等农民起义</div>
            </div>
            <div class="event-item">
                <div class="event-year">1644年</div>
                <div>李自成攻入北京，崇祯帝煤山自缢</div>
            </div>
            <p>崇祯帝勤政图治，铲除魏忠贤，试图挽救明朝。但面对内忧外患，农民起义和后金（清）的双重打击，最终无力回天。1644年李自成攻入北京，崇祯帝在煤山自缢，明朝灭亡。</p>
        `
    }
];

function createTimeline() {
    const timeline = document.getElementById('timeline');

    emperors.forEach((emperor, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.style.animationDelay = `${index * 0.15}s`;

        timelineItem.innerHTML = `
            <div class="timeline-marker" data-index="${index}"></div>
            <div class="timeline-content" data-index="${index}">
                <div class="emperor-name">${emperor.name}</div>
                <div class="era-name">${emperor.title} · ${emperor.era}帝</div>
                <div class="reign-period">${emperor.reign}（${emperor.duration}）</div>
                <div class="achievements">
                    ${emperor.achievements.map(achievement => 
                        `<span class="achievement-tag">${achievement}</span>`
                    ).join('')}
                </div>
                <div class="details">
                    <div class="details-title">历史详情</div>
                    <div class="details-content">${emperor.details}</div>
                </div>
                <div class="expand-indicator">▼</div>
            </div>
        `;

        timeline.appendChild(timelineItem);
    });

    addEventListeners();
}

function addEventListeners() {
    const contents = document.querySelectorAll('.timeline-content');

    contents.forEach(content => {
        content.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
}

document.addEventListener('DOMContentLoaded', createTimeline);