import json
S={'u':('INSEE, Labour Force Survey, Q3 2026 (10 Nov 2026)','https://www.insee.fr/en/statistiques/9132864'),
'g':('INSEE, quarterly national accounts, first estimate Q3 2026 (30 Oct 2026)','https://www.insee.fr/en/statistiques/9113712'),
'c':('INSEE, consumer price index, provisional October 2026 (30 Oct 2026)','https://www.insee.fr/en/statistiques/9107975'),
'f':('INSEE, general government accounts 2025 (May 2026)','https://www.insee.fr/fr/statistiques/8997691'),
'b':('Admirals budget explainer citing the government press file and Public Sénat','https://admiralmarkets.com/analytics/traders-blog/france-budget-2027-assembly-rejection-senate'),
'rb':('RFI, 5 Nov 2026','https://www.rfi.fr/en/france/20261105-french-mps-unanimously-reject-2027-budget-as-political-deadlock-deepens'),
'e':('Elabe barometer, 3-4 Nov 2026, via frenchpolitics.fr','https://www.frenchpolitics.fr/news/polls/macron-poll-approval-rating-november-2026/'),
'el':('Elabe barometer via The Rio Times, 5 Nov 2026','https://www.riotimesonline.com/macron-trust-record-low-elabe-poll-nov-5/'),
'bbc':('BBC News, 5 Nov 2026','https://www.bbc.com/news/articles/ckx2qzv835pgo'),
'w':('Wikipedia, 2026 French civil unrest (citing ministries and press)','https://en.wikipedia.org/wiki/2026_French_civil_unrest'),
'cn':('CNews live report citing the ministries, 5 Nov 2026','https://www.cnews.fr/france/2026-11-05/manifestations-du-5-novembre-575000-manifestants-dans-toute-la-france-448'),
'h':('HuffPost, 14 Nov 2026 (Interior Ministry count)','https://www.facebook.com/LeHuffPost/posts/pour-le-quatri%C3%A8me-samedi-cons%C3%A9cutif-la-mobilisation-est-en-baisse-ce-14-novembre/1603911078440782/'),
's':('Sortiraparis, 9 Nov 2026 (social conference announcements)','https://www.sortiraparis.com/en/news/in-paris/articles/259646-minimum-wage-an-increase-from-december-1-2026-has-been-confirmed-what-to-expect'),
'r':('RFI, 27 Oct 2026','https://www.rfi.fr/en/france/20261027-france-pledges-admissions-overhaul-and-education-funding-to-ease-protests'),
'wsj':('Wall Street Journal, 26 Oct 2026','https://www.wsj.com/world/europe/france-offers-concessions-to-quell-student-protests-2e164758'),
'p':('Reuters via Yahoo News, 13 Nov 2026','https://malaysia.news.yahoo.com/frances-le-pen-seeks-square-111158295.html'),
'ba':('Batinfo, 5 Nov 2026 (2027 social security bill)','https://batinfo.com/en/actuality/2027-social-security-budget%3A-the-Senate-wants-to-reinstate-the-pension-reform-and-better-protect-small-pensions_37873'),
'ep':('European Pensions (pension system deficit 2025)','https://www.europeanpensions.net/ep/French-pension-system-deficit-estimated-at-5-1bn-in-2025.php'),
'r5':('RFI, 5 Nov 2026','https://www.rfi.fr/en/france/20261105-french-unions-join-forces-for-nationwide-strike-as-protests-intensify'),
'lm':('Le Monde, 14 Nov 2026','https://www.lemonde.fr/en/politics/article/2026/11/14/french-social-unrest-between-concessions-and-tough-talk-pm-lecornu-struggles-to-end-crisis_6780688_5.html'),
'ici':('ICI (Radio France) live report, 5 Nov 2026','https://www.ici.fr/infos/economie-social/direct-greve-du-5-novembre-les-syndicats-dans-la-rue-ce-jeudi-pour-les-salaires-et-contre-la-vie-chere-7257620'),
'oe':('OECD, Education at a Glance 2026, table D2.3','https://www.oecd.org/en/publications/2026/09/education-at-a-glance-2026_3bce4131/full-report/how-do-student-teacher-ratios-and-class-sizes-vary-across-education-levels_30c0e06c.html'),
'tr':('Ministry of Labour, 2025 audience measurement','https://travail-emploi.gouv.fr/representativite-syndicale-et-patronale-les-resultats-de-la-mesure-daudience-2025'),
'ir':('INSEE, localised unemployment rates, Q2 2026 (18 Sep 2026)','https://www.insee.fr/fr/statistiques/9053037'),
}
def w(n,rows): json.dump(rows,open('data/%s.json'%n,'w'),ensure_ascii=False,indent=0); print(n,len(rows))
F=[]
def f(k,label,v,unit,period,s): F.append(dict(key=k,label=label,value=v,unit=unit,period=period,source=S[s][0],url=S[s][1]))
f('unemp','ILO unemployment rate',8.2,'%','Q3 2026','u');f('unemp_yoy','Unemployment rate, change over one year',0.4,'points','Q3 2026 vs Q3 2025','u')
f('unemp_n','Unemployed people',2.63,'million','Q3 2026','u');f('unemp_add','Extra unemployed people over one year',150,'thousand','Q3 2026 vs Q3 2025','u')
f('youth','Unemployment rate, ages 15-24',21.0,'%','Q3 2026','u');f('lt','Long-term unemployed (one year or more)',680,'thousand','Q3 2026','u');f('neet','Ages 15-29 not in employment, education or training',13.3,'%','Q3 2026','u')
f('emp55','Employment rate, ages 55-64',62.0,'%','Q3 2026','u')
f('gdp_q3','GDP growth, quarter on quarter',-0.1,'%','Q3 2026','g');f('gdp_q2','GDP growth, quarter on quarter',0.0,'%','Q2 2026','g');f('gdp_q1','GDP growth, quarter on quarter',-0.2,'%','Q1 2026','g')
f('gdp_2025','GDP growth, full year',0.9,'%','2025','g');f('gdp_carry','Growth already locked in for 2026 (carry-over)',0.2,'%','2026 after Q3','g')
f('inv_q3','Investment (GFCF), quarter on quarter',-0.6,'%','Q3 2026','g');f('exp_q3','Exports, quarter on quarter',-1.7,'%','Q3 2026','g');f('cons_q3','Household consumption, quarter on quarter',0.4,'%','Q3 2026','g')
f('manuf_q3','Manufacturing output, quarter on quarter',-1.4,'%','Q3 2026','g');f('pp_q2','Household purchasing power per consumption unit, quarter on quarter',-0.5,'%','Q2 2026','g')
f('cpi','Consumer prices, year on year (provisional)',3.4,'%','October 2026','c');f('cpi_prev','Consumer prices, year on year',3.1,'%','September 2026','c');f('cpi_ya','Consumer prices, year on year',0.9,'%','October 2025','c')
f('energy','Energy prices, year on year (provisional)',24.1,'%','October 2026','c');f('fresh','Fresh food prices, year on year (provisional)',8.0,'%','October 2026','c');f('hicp','Harmonised index (HICP), year on year (provisional)',3.8,'%','October 2026','c')
f('diesel','Diesel pump price',2.37,'€ per litre','September 2026','w')
f('smic_h','Gross hourly minimum wage (Smic)',12.31,'€','since 1 June 2026','bbc');f('smic_old','Net monthly minimum wage before the rise',1477.93,'€','November 2026','s');f('smic_new','Net monthly minimum wage after the rise (approx.)',1502,'€','from 1 December 2026','s')
f('smic_rise','Minimum wage rise',1.6,'%','from 1 December 2026','s');f('smic_boost','Discretionary part of the rise',0.6,'points','from 1 December 2026','s');f('smic_gain','Net monthly gain (approx.)',24,'€','from 1 December 2026','s')
f('cgt_ask','CGT demand: immediate minimum wage rise',10,'%','5 Nov 2026','w');f('cfdt_ask','CFDT demand: extra net pay per month',100,'€','5 Nov 2026','bbc')
f('debt','Public debt, share of GDP (approx.)',119,'% of GDP','end-June 2026','w');f('debt_eur','Public debt',3.596,'€ trillion','end-June 2026','w');f('debt_2025','Public debt, share of GDP',115.7,'% of GDP','end-2025','f')
f('def_2025','Public deficit',5.1,'% of GDP','2025','f');f('def_2026','Public deficit, government forecast',5.4,'% of GDP','2026','b');f('def_2027','Public deficit, budget target',5.0,'% of GDP','2027','b');f('def_amend','Deficit implied by the Assembly amendments (minister estimate)',5.9,'% of GDP','2027','rb')
f('debt_2027','Public debt in the draft budget',121.7,'% of GDP','2027','b');f('spend','Public spending, share of GDP',57.3,'% of GDP','2025','f')
f('savings','New savings measures in the draft 2027 budget',43,'€ billion','2027','b');f('vote_no','National Assembly votes against the revenue part of the budget',458,'votes','4 Nov 2026','b');f('vote_yes','Votes in favour',0,'votes','4 Nov 2026','b')
f('oat_peak','10-year government bond yield, level passed on 21 October',5,'%','21 Oct 2026','b');f('spread_peak','Yield gap with Germany, weekly close',174,'basis points','week of 19-23 Oct 2026','b');f('oat_now','10-year government bond yield',4.70,'%','10 Nov 2026','b')
f('trust','Trust in President Macron',13,'%','3-4 Nov 2026','e');f('distrust','Distrust in President Macron',82,'%','3-4 Nov 2026','e');f('notrust','No trust at all in President Macron',60,'%','3-4 Nov 2026','e');f('lecornu','Trust in Prime Minister Lecornu',17,'%','Nov 2026','el')
f('justified','Say the student movement is justified (Odoxa)',62,'%','1 Oct 2026','w');f('lepen','Expect Marine Le Pen to gain from the unrest (Odoxa)',74,'%','27 Oct 2026','w')
f('t_int','Marchers on 5 November, Interior Ministry',575,'thousand','5 Nov 2026','w');f('t_cgt','Marchers on 5 November, CGT',1.57,'million','5 Nov 2026','bbc');f('t_sat','Marchers on Saturday 14 November, Interior Ministry',106,'thousand','14 Nov 2026','h')
f('police','Police and gendarmes deployed',70,'thousand','5 Nov 2026','bbc');f('arrests','Arrests since the start',2700,'people','as of 22 Oct 2026','w');f('jailed','Jailed after fast-track trials',217,'people','as of 22 Oct 2026','w')
f('shops','Shops looted on 17 October',2000,'shops (more than)','17 Oct 2026','bbc');f('officers','Police officers injured on 17 October',1000,'officers (about)','17 Oct 2026','w')
f('teach_strike','Teachers on strike, Education Ministry',15.81,'%','5 Nov 2026','cn');f('lyc_gov','Lycées blocked, government count',81,'schools','5 Nov 2026','cn');f('lyc_usl','Lycées at a standstill, student union count',1000,'schools','5 Nov 2026','cn');f('lyc_all','Lycées in France',3700,'schools','2026','cn')
f('class_cap','New cap for first-year lycée classes',28,'pupils','from 2027','r');f('class_now','Current average first-year lycée class (more than)',30,'pupils','2026','wsj')
f('places_offer','Extra higher-education places offered',15,'thousand','2027-2028','r');f('places_ask','Extra university places demanded by students',250,'thousand','Oct 2026','r')
f('reno','Low-interest loans for school renovation',4,'€ billion','until 2030','r');f('uni_reno','University renovation programme',1,'€ billion','until 2029','r');f('posts','Extra secondary teaching posts',500,'posts','announced 26 Oct 2026','r')
f('pens','Pension spending',436,'€ billion','2027','p');f('pens_gdp','Pension spending, share of GDP',14,'% of GDP','2027','p');f('pens_cost','Yearly cost of reversing the 2023 reform (public audit office)',10,'€ billion','per year','p')
f('pens_def','Pension system deficit',5.1,'€ billion','2025','ep');f('ss_2026','Social security deficit',21.8,'€ billion','2026','ba');f('ss_2027','Social security deficit, bill target',12.7,'€ billion','2027','ba')
f('thr_gov','Monthly pension below which pensions keep rising with inflation, government bill',1260,'€','2027','ba');f('thr_sen','Same threshold, Senate version',1500,'€','2027','ba');f('sen_save','Saving from reinstating the reform, Senate estimate',600,'€ million','2027','ba')
f('barrels','Diesel released from strategic reserves',10,'million barrels','7 Oct 2026','w');f('stations','Service stations where diesel prices fell',6000,'stations','5 Nov 2026','r5');f('stations_all','Service stations in France',10000,'stations','2026','r5')
f('ot_old','Tax-free overtime ceiling, before',7500,'€','2026','s');f('ot_new','Tax-free overtime ceiling, after',10000,'€','2027','s');f('sectors','Industry sectors with pay scales below the minimum wage',69,'sectors','Nov 2026','s')
w('facts',F)
q=lambda y0,y1:[f'{y}-Q{i}' for y in range(y0,y1+1) for i in (1,2,3,4)]
ut=[10.3,10.5,10.4,10.3,10.2,10.1,9.9,10.1,9.7,9.6,9.5,9.0,9.3,9.1,9.0,8.8,8.8,8.5,8.4,8.2,7.9,7.2,9.0,8.1,8.2,8.0,7.9,7.5,7.4,7.5,7.2,7.2,7.2,7.3,7.4,7.6,7.5,7.4,7.4,7.4,7.5,7.6,7.8,8.0,8.2,8.3,8.2]
um=[9.5,9.6,9.5,9.4,9.4,9.2,8.7,9.2,8.8,8.7,8.8,8.2,8.5,8.4,8.2,8.0,7.8,7.7,7.6,7.3,7.1,6.4,8.3,7.4,7.5,7.1,7.1,6.8,6.7,6.7,6.5,6.5,6.5,6.7,6.8,7.1,6.9,6.7,6.6,6.7,6.8,7.0,7.1,7.0,7.3,7.5,7.3]
qs=q(2015,2026)[:len(ut)]
def qd(s): y,k=s.split('-Q'); return f'{y}-{(int(k)-1)*3+2:02d}-15'
w('unemployment',[dict(quarter=a,date=qd(a),rate=b,rate_25_49=c) for a,b,c in zip(qs,ut,um)])
w('unemployment_groups',[dict(group=g,rate=r,change_1y=c) for g,r,c in [('Ages 15-24',21.0,1.6),('Men',8.6,0.8),('All',8.2,0.4),('Women',7.8,0.0),('Ages 25-49',7.3,0.2),('Ages 50 and over',5.6,0.5)]])
R=[('84','Auvergne-Rhône-Alpes',7.2,.7),('27','Bourgogne-Franche-Comté',7.4,.6),('53','Bretagne',6.8,.7),('24','Centre-Val de Loire',7.8,.9),('94','Corse',6.9,.5),('44','Grand Est',7.9,.7),('32','Hauts-de-France',10.0,.9),('11','Île-de-France',8.2,.9),('28','Normandie',7.9,.7),('75','Nouvelle-Aquitaine',7.5,.7),('76','Occitanie',9.7,.7),('52','Pays de la Loire',6.8,.7),('93',"Provence-Alpes-Côte d'Azur",8.7,.7),('01','Guadeloupe',16.4,-.1),('02','Martinique',12.8,-1.1),('03','Guyane',20.4,3.4),('04','La Réunion',18.8,3.4)]
w('unemployment_regions',[dict(code=a,region=b,rate=c,change_1y=d,overseas=a<'10') for a,b,c,d in R])
gg=[0.0,0.4,0.5,0.4,0.1,0.9,0.4,0.5,0.2,0.2,0.5,-0.1,0.2,0.2,0.5,0.2,-0.2,0.0,-0.1]
gc=[(-.05,.39,-.3,-.07),(-.09,-.5,.55,.44),(.22,-.68,.49,.5),(.16,.27,0,-.05),(.01,.42,.13,-.43),(.28,.79,.13,-.26),(-.01,.03,.43,-.05),(-.18,.89,.02,-.26),(-.15,.36,.26,-.24),(.07,.32,-.04,-.13),(-.17,-.43,.48,.61),(.01,.19,.04,-.29),(.06,-.42,-.05,.58),(.08,-.34,.08,.42),(.18,.69,.18,-.59),(.02,.52,.2,-.51),(-.18,-.86,-.09,.96),(-.11,.64,.2,-.74),(-.13,-.63,.27,.36)]
w('gdp',[dict(quarter=a,growth=b,investment=c[0],net_trade=c[1],consumption=c[2],inventories=c[3]) for a,b,c in zip(q(2022,2026),gg,gc)])
cp=[0.6,0.6,1.1,1.2,1.4,1.5,1.1,1.9,2.2,2.6,2.8,2.8,2.9,3.6,4.5,4.8,5.2,5.8,6.1,5.9,5.5,6.2,6.1,5.8,6.0,6.3,5.7,5.9,5.1,4.5,4.3,4.9,4.9,4.0,3.5,3.7,3.1,3.0,2.3,2.2,2.3,2.2,2.3,1.8,1.1,1.2,1.3,1.3,1.6,0.8,0.8,0.8,0.7,1.0,1.0,0.9,1.2,0.9,0.9,0.8,0.3,0.9,1.7,2.2,2.4,1.8,2.1,2.4,3.1,3.4]
ms=[f'{y}-{m:02d}' for y in range(2021,2027) for m in range(1,13)][:len(cp)]
w('inflation',[dict(month=a,date=a+'-15',cpi_yoy=b) for a,b in zip(ms,cp)])
w('inflation_components',[dict(component=a,oct_2026=b,oct_2025=c) for a,b,c in [('Energy',24.1,-5.6),('Fresh food',8.0,-2.2),('All items',3.4,0.9),('Tobacco',3.3,4.1),('Services',2.7,2.4),('Food',1.2,1.3),('Manufactured products',-0.2,-0.5)]])
tv=[45,45,45,40,37,40,38,40,42,38,41,39,41,40,34,36,31,30,27,23,25,27,31,28,27,32,31,28,33,33,28,30,32,31,29,39,34,33,35,39,35,32,35,32,35,36,34,33,33,36,36,34,37,35,34,36,32,35,40,38,34,32,37,38,36,32,32,35,32,30,32,25,25,29,29,29,28,27,27,28,27,25,27,25,29,24,25,27,25,22,21,21,18,21,27,26,26,24,22,21,17,14,16,18,16,19,25,23,20,26,23,24,20,17,13]
tm=[f'{y}-{m:02d}' for y in range(2017,2027) for m in range(1,13)][4:4+len(tv)]
assert tm[-1]=='2026-11',tm[-1]; assert ms[-1]=='2026-10'; assert qs[-1]=='2026-Q3'
w('trust',[dict(month=a,date=a+'-15',trust=b) for a,b in zip(tm,tv)])
w('protest_days',[dict(date=a,day=b,interior_thousand=c,organisers_thousand=d,note=e) for a,b,c,d,e in [
('2026-10-08','8 Oct',71.5,None,'Marches only; a further 55,000 outside schools'),('2026-10-13','13 Oct',161.5,480,'Fifth national day of action; organiser figure from the youth inter-union'),
('2026-10-17','17 Oct',550,800,'Largest Saturday; widespread looting and arson'),('2026-10-24','24 Oct',410,800,'Organiser figure from the CGT'),
('2026-10-31','31 Oct',320,None,'About 150 demonstrations'),('2026-11-05','5 Nov',575,1570,'Inter-union strike day; organiser figure from the CGT'),
('2026-11-07','7 Nov',146,250,'Weekend of 6-7 November; organiser figure from student unions'),('2026-11-14','14 Nov',106,None,'Fourth Saturday of falling turnout')]])
w('protest_cities',[dict(city=a,lat=b,lon=c,police=d,unions=e) for a,b,c,d,e in [('Paris',48.8566,2.3522,None,350000),('Marseille',43.2965,5.3698,14000,150000),('Lyon',45.764,4.8357,30000,55000),('Strasbourg',48.5734,7.7521,10000,26000),('Nantes',47.2184,-1.5536,None,30000),('Perpignan',42.6887,2.8948,3500,6000),('Clermont-Ferrand',45.7772,3.087,5200,None)]])
w('public_finances',[dict(year=a,deficit=b,debt=c,status=d) for a,b,c,d in [('2022',4.7,111.4,'actual'),('2023',5.4,109.5,'actual'),('2024',5.8,112.6,'actual'),('2025',5.1,115.7,'actual'),('2026',5.4,119.0,'government forecast; debt as of end-June'),('2027',5.0,121.7,'draft budget target')]])
w('bond_spread',[dict(period=a,oat_yield=b,bund_yield=c,spread_bp=d,kind=e) for a,b,c,d,e in [('2021',0.01,-0.37,38,'annual average'),('2022',1.70,1.14,56,'annual average'),('2023',2.99,2.43,56,'annual average'),('2024',2.98,2.32,65,'annual average'),('2025',3.37,2.61,76,'annual average'),('23 Oct 2026',None,None,174,'weekly close'),('26 Oct 2026',None,None,153,'daily close')]])
w('unions',[dict(union=a,audience_2025=b,position=c) for a,b,c in [('CFDT',26.58,'Asks for €100 more net pay a month; joins the 17 November strike'),('CGT',22.21,'Asks for an immediate 10% minimum wage rise; called the 9 November measures "crumbs"'),('FO',14.91,'Took part in the 5 November strike day'),('CFE-CGC',12.95,'Took part in the 5 November strike day'),('CFTC',9.58,'Took part in the 5 November strike day')]])
w('strike_rates',[dict(sector=a,rate=b,counted_by=c) for a,b,c in [('Teachers',15.81,'Education Ministry'),('State civil servants',9.89,'Government'),('Local government staff',4.6,'Government'),('Public hospital staff',3.93,'Government')]])
w('class_size',[dict(level=a,year=b,france=c,oecd=d,label=f'{a}, {b}') for a,b,c,d in [('Primary','2015',24,21),('Primary','2024',21,21),('Lower secondary','2015',25,23),('Lower secondary','2024',26,23)]])
M=[('m01','16 Sep','Cost of living','Fuel subsidies for affected industries raised to the EU maximum, until 31 December','Temporary subsidy','Short term','Expires in weeks; does nothing about the price shock itself.'),
('m02','2 Oct','Cost of living','G7 release of 100 million barrels of oil and diesel over four months','Emergency stock release','Short term','A one-off release; stocks must be rebuilt later.'),
('m03','7 Oct','Cost of living','10 million barrels of diesel released from French strategic reserves','Emergency stock release','Short term','Lowered prices at about 6 in 10 stations; one-off.'),
('m04','26 Oct','Schools','First-year lycée classes capped at 28 pupils, starting in disadvantaged schools from 2027','Rule change','Long term, partial','Structural, but covers one year group and starts in some schools only.'),
('m05','26 Oct','Schools','Planned cuts to secondary teaching posts cancelled, plus 500 new posts','Staffing','Short term','Stops a cut; 500 posts is small against thousands of schools.'),
('m06','26 Oct','Schools','Up to €4 billion in low-interest loans to regions for school renovation, until 2030','Loans','Long term, partial','Multi-year, but loans add to regional debt rather than new state money.'),
('m07','26 Oct','Universities','€1 billion university renovation programme, until 2029','Investment','Long term, partial','Multi-year investment, modest in size.'),
('m08','26 Oct','Universities','15,000 extra higher-education places across 2027 and 2028','Capacity','Long term, partial','Students asked for 250,000 places.'),
('m09','26 Oct','Universities','Parcoursup admissions platform reformed for 2027 and replaced in 2028','Reform','Long term','A real structural change, delivered after the 2027 election.'),
('m10','26 Oct','Universities','Student grants to rise with inflation from the 2027 academic year','Indexation','Long term, partial','Protects grants from inflation but does not raise them.'),
('m11','9 Nov','Wages','Minimum wage up 1.6% from 1 December (about €24 net a month)','Pay rise','Short term','Mostly the automatic January rise brought forward one month, plus 0.6 points.'),
('m12','9 Nov','Wages','Tax-free overtime ceiling raised to €10,000; value-sharing bonus extended; 75% cover of transport passes kept for 2027','Tax and bonus measures','Short term','Helps people already in work who do overtime; no general pay rise.'),
('m13','9 Nov','Wages','69 sectors with pay scales below the minimum wage told to renegotiate; employer contribution relief tied to compliance','Bargaining rules','Long term, partial','Could lift low pay scales lastingly if the decree is enforced.'),
('m14','13 Nov','Wages','Public-sector pay talks postponed to 11 December','Delay','Deferral','Unions called it stalling; the CFDT joined the 17 November strike in response.'),
('m15','Since Oct','Public order','Up to 70,000 police deployed per protest day; fast-track trials; bill making protesters liable for damage','Policing','Short term','Contains unrest without addressing its causes.'),
('m16','Oct-Dec','Public finances','2027 budget: €43 billion of savings to cut the deficit to 5.0% of GDP','Fiscal consolidation','Long term, blocked','The only long-run plan, rejected 458 to 0 in the Assembly on 4 November.'),
('m17','2025-27','Pensions','2023 pension reform (retirement at 64) suspended; pensions above €1,260 a month to rise by less than inflation','Suspension and savings','Deferral','Postpones the decision past the 2027 election; reversing the reform would cost about €10 billion a year.')]
w('measures',[dict(id=a,date=b,area=c,measure=d,type=e,horizon=g,why=h) for a,b,c,d,e,g,h in M])
