/* Official per-state links. Source: NASS CanIVote.org (nass.org/can-i-vote), scraped 2026-09-01.
   Mail-ballot category source: NCSL Table 1, last updated 2026-07-17.
   Every URL below points to a state government election site. Do not edit by hand without re-verifying. */
const STATES = [
 {
  "name": "Alabama",
  "abbr": "AL",
  "mail": "excuse",
  "status": "https://myinfo.alabamavotes.gov/voterview",
  "register": "https://www.sos.alabama.gov/alabama-votes/voter/register-to-vote",
  "absentee": "https://www.sos.alabama.gov/alabama-votes/voter/absentee-voting",
  "polling": "https://myinfo.alabamavotes.gov/voterview",
  "id": "https://sos.alabama.gov/alabama-votes/photo-voter-id"
 },
 {
  "name": "Alaska",
  "abbr": "AK",
  "mail": "no_excuse",
  "status": "https://myvoterportal.alaska.gov/",
  "register": "https://www.elections.alaska.gov/voter-information/#Reg",
  "absentee": "https://www.elections.alaska.gov/Core/AKVoteEarly.php",
  "polling": "https://akelections.maps.arcgis.com/apps/webappviewer/index.html?id=579890d66c7e40ae9f7cc227d76669b1",
  "id": "https://www.elections.alaska.gov/voter-information/"
 },
 {
  "name": "Arizona",
  "abbr": "AZ",
  "mail": "no_excuse",
  "status": "https://my.arizona.vote/WhereToVote.aspx?s=individual",
  "register": "https://azsos.gov/elections/voters/registering-vote",
  "absentee": "https://my.arizona.vote/Early/ApplicationLogin.aspx",
  "polling": "https://my.arizona.vote/WhereToVote.aspx?s=address",
  "id": "https://azsos.gov/elections/voters/voting-elections"
 },
 {
  "name": "Arkansas",
  "abbr": "AR",
  "mail": "excuse",
  "status": "https://www.voterview.ar-nova.org/voterview",
  "register": "https://www.sos.arkansas.gov/elections/voter-information/voter-registration-information",
  "absentee": "https://www.sos.arkansas.gov/elections/voter-information/absentee-voting",
  "polling": "https://www.voterview.ar-nova.org/",
  "id": "https://www.sos.arkansas.gov/elections/voter-information/voter-registration-information/voting-in-arkansas"
 },
 {
  "name": "California",
  "abbr": "CA",
  "mail": "all_mail",
  "status": "https://voterstatus.sos.ca.gov/",
  "register": "https://registertovote.ca.gov/",
  "absentee": "https://www.sos.ca.gov/elections/voter-registration/vote-mail#vote-by-mail",
  "polling": "https://www.sos.ca.gov/elections/polling-place/",
  "id": "https://www.sos.ca.gov/elections/voting-resources/voting-california/what-bring/"
 },
 {
  "name": "Colorado",
  "abbr": "CO",
  "mail": "all_mail",
  "status": "https://www.sos.state.co.us/voter/pages/pub/olvr/findVoterReg.xhtml",
  "register": "https://www.sos.state.co.us/voter/pages/pub/olvr/verifyNewVoter.xhtml",
  "absentee": "https://www.sos.state.co.us/pubs/elections/FAQs/ElectionDay.html",
  "polling": "https://www.sos.state.co.us/voter/pages/pub/olvr/findVoterReg.xhtml",
  "id": "https://www.sos.state.co.us/pubs/elections/vote/acceptableFormsOfID.html"
 },
 {
  "name": "Connecticut",
  "abbr": "CT",
  "mail": "no_excuse",
  "status": "https://portaldir.ct.gov/sots/LookUp.aspx",
  "register": "https://portal.ct.gov/SOTS/Election-Services/Voter-Information/Voter-Registration-Information",
  "absentee": "https://portal.ct.gov/SOTS/Election-Services/Voter-Information/Absentee-Voting",
  "polling": "https://www.dir.ct.gov/sots/LookUp.aspx",
  "id": "https://portal.ct.gov/SOTS/Election-Services/FAQ/FAQ---Voter-Identification"
 },
 {
  "name": "Delaware",
  "abbr": "DE",
  "mail": "excuse",
  "status": "https://ivote.de.gov/voterview",
  "register": "https://elections.delaware.gov/voter/votereg.shtml#how",
  "absentee": "https://elections.delaware.gov/voter/absentee/",
  "polling": "https://ivote.de.gov/voterview",
  "id": "https://elections.delaware.gov/public/faq/voting.shtml"
 },
 {
  "name": "District of Columbia",
  "abbr": "DC",
  "mail": "all_mail",
  "status": "https://apps.dcboe.org/VRS",
  "register": "https://www.dcboe.org/voters/register-to-vote/register-update-voter-registration",
  "absentee": "https://www.dcboe.org/voters/casting-your-vote/voting-by-special-ballot",
  "polling": "https://dcboe.org/voters/find-out-where-to-vote/vote-center-locator-tool",
  "id": "https://dcboe.org/faqs/early-voting-and-election-day"
 },
 {
  "name": "Florida",
  "abbr": "FL",
  "mail": "no_excuse",
  "status": "https://registration.elections.myflorida.com/CheckVoterStatus",
  "register": "https://registertovoteflorida.gov/home",
  "absentee": "https://dos.myflorida.com/elections/for-voters/voting/vote-by-mail/",
  "polling": "https://registration.elections.myflorida.com/",
  "id": "https://dos.myflorida.com/elections/for-voters/voting/election-day-voting/"
 },
 {
  "name": "Georgia",
  "abbr": "GA",
  "mail": "no_excuse",
  "status": "https://www.mvp.sos.ga.gov/MVP/mvp.do",
  "register": "https://mvp.sos.ga.gov/s/olvr-home",
  "absentee": "https://www.mvp.sos.ga.gov/MVP/mvp.do",
  "polling": "https://www.mvp.sos.ga.gov/",
  "id": "https://sos.ga.gov/page/georgia-voter-identification-requirements"
 },
 {
  "name": "Hawaii",
  "abbr": "HI",
  "mail": "all_mail",
  "status": "https://olvr.hawaii.gov/%28S%28vb2rcnebimyjdjcs5q22kazp%29%29/Default.aspx",
  "register": "https://olvr.hawaii.gov/%28S%28vb2rcnebimyjdjcs5q22kazp%29%29/Default.aspx",
  "absentee": "https://elections.hawaii.gov/voting/voting-in-hawaii/",
  "polling": "https://elections.hawaii.gov/voting/voting-in-hawaii/",
  "id": "https://elections.hawaii.gov/voting/voting-in-hawaii/"
 },
 {
  "name": "Idaho",
  "abbr": "ID",
  "mail": "no_excuse",
  "status": "https://elections.sos.idaho.gov/ElectionLink/ElectionLink/VoterSearch.aspx",
  "register": "https://elections.sos.idaho.gov/ElectionLink/ElectionLink/ApplicationInstructions.aspx",
  "absentee": "https://voteidaho.gov/casting-your-ballot/#vote-early",
  "polling": "https://elections.sos.idaho.gov/ElectionLink/ElectionLink/ViewPollingLocation.aspx",
  "id": "https://voteidaho.gov/identification-requirements/"
 },
 {
  "name": "Illinois",
  "abbr": "IL",
  "mail": "no_excuse",
  "status": "https://ova.elections.il.gov/RegistrationLookup.aspx",
  "register": "https://ova.elections.il.gov/",
  "absentee": "https://www.elections.il.gov/electionoperations/votingbymail.aspx",
  "polling": "https://ova.elections.il.gov/PollingPlaceLookup.aspx",
  "id": "https://www.elections.il.gov/Main/FAQ.aspx?MID=whDn5mxRbJU%3d&amp;MFAQH=7fm7seT6Z57C0ZS041fSEpqzAyRc0qFWU8X5%2fKAmF3iBIyOKd0C3p4KeZ8Te8x1u#BEREP"
 },
 {
  "name": "Indiana",
  "abbr": "IN",
  "mail": "excuse",
  "status": "https://indianavoters.in.gov/",
  "register": "https://indianavoters.in.gov/PublicSite/PublicMain.aspx",
  "absentee": "https://www.in.gov/sos/elections/2402.htm",
  "polling": "https://indianavoters.in.gov/PublicSite/PublicMain.aspx",
  "id": "https://www.in.gov/sos/elections/2401.htm"
 },
 {
  "name": "Iowa",
  "abbr": "IA",
  "mail": "no_excuse",
  "status": "https://sos.iowa.gov/elections/voterreg/regtovote/search.aspx",
  "register": "https://sos.iowa.gov/voters/voter-registration",
  "absentee": "https://sos.iowa.gov/voters/absentee-voting",
  "polling": "https://sos.iowa.gov/elections/voterreg/pollingplace/search.aspx",
  "id": "https://sos.iowa.gov/voters/voter-id-faq"
 },
 {
  "name": "Kansas",
  "abbr": "KS",
  "mail": "no_excuse",
  "status": "https://myvoteinfo.voteks.org/VoterView/",
  "register": "https://www.kdor.ks.gov/Apps/VoterReg/Default.aspx",
  "absentee": "https://sos.ks.gov/elections/voter-information.html",
  "polling": "https://myvoteinfo.voteks.org/VoterView",
  "id": "https://sos.ks.gov/elections/photo-id.html"
 },
 {
  "name": "Kentucky",
  "abbr": "KY",
  "mail": "excuse",
  "status": "https://vrsws.sos.ky.gov/VIC/",
  "register": "https://vrsws.sos.ky.gov/ovrweb/",
  "absentee": "https://elect.ky.gov/Voters/Pages/Absentee-Voting.aspx",
  "polling": "https://vrsws.sos.ky.gov/ovrweb/govoteky",
  "id": "https://elect.ky.gov/Frequently-Asked-Questions/Pages/Election-Day-Information.aspx"
 },
 {
  "name": "Louisiana",
  "abbr": "LA",
  "mail": "excuse",
  "status": "https://voterportal.sos.la.gov/Home/VoterLogin",
  "register": "https://www.sos.la.gov/elections-voting/register-to-vote",
  "absentee": "https://www.sos.la.gov/elections-voting/absentee-voting-faqs",
  "polling": "https://voterportal.sos.la.gov/",
  "id": "https://www.sos.la.gov/elections-voting/before-an-election-faqs#accordion-item-2e609ef6:~:text=Acceptable%20forms%20of%20photo%20ID"
 },
 {
  "name": "Maine",
  "abbr": "ME",
  "mail": "no_excuse",
  "status": "https://www1.maine.gov/portal/government/edemocracy/voter_lookup.php",
  "register": "https://www.maine.gov/sos/cec/elec/voter-info/votreg.html",
  "absentee": "https://www.maine.gov/sos/cec/elec/voter-info/absent.html",
  "polling": "https://www.maine.gov/portal/government/edemocracy/voter_lookup.php",
  "id": "https://www.maine.gov/sos/elections-voting/state-of-maine-voter-guide#:~:text=The%20following%20documents%20are%20acceptable%20proof%20of%20identification%20for%20the%20purposes%20of%20registering%20to%20vote"
 },
 {
  "name": "Maryland",
  "abbr": "MD",
  "mail": "no_excuse",
  "status": "https://voterservices.elections.maryland.gov/VoterSearch",
  "register": "https://www.elections.maryland.gov/voter_registration/index.html",
  "absentee": "https://elections.maryland.gov/voting/absentee.html",
  "polling": "https://elections.maryland.gov/voting/where.html",
  "id": "https://elections.maryland.gov/voting/election_day_questions.html"
 },
 {
  "name": "Massachusetts",
  "abbr": "MA",
  "mail": "no_excuse",
  "status": "https://www.sec.state.ma.us/voterregistrationsearch/myvoterregstatus.aspx",
  "register": "https://www.sec.state.ma.us/divisions/elections/voter-resources/registering-to-vote.htm",
  "absentee": "https://www.sec.state.ma.us/divisions/elections/voting-information/vote-by-mail.htm",
  "polling": "https://www.sec.state.ma.us/WhereDoIVoteMA/WhereDoIVote",
  "id": "https://www.sec.state.ma.us/divisions/elections/voter-resources/when-where-how-do-i-vote.htm"
 },
 {
  "name": "Michigan",
  "abbr": "MI",
  "mail": "no_excuse",
  "status": "https://mvic.sos.state.mi.us/Voter/Index",
  "register": "https://www.michigan.gov/sos/elections/voting/register-to-vote",
  "absentee": "https://www.michigan.gov/sos/elections/voting/absentee-voting",
  "polling": "https://mvic.sos.state.mi.us/Voter/index",
  "id": "https://www.michigan.gov/sos/faqs/elections-and-campaign-finance/elections-and-voting"
 },
 {
  "name": "Minnesota",
  "abbr": "MN",
  "mail": "no_excuse",
  "status": "https://mnvotes.sos.mn.gov/voterstatuscheck/index",
  "register": "https://www.sos.mn.gov/elections-voting/register-to-vote/",
  "absentee": "https://www.sos.mn.gov/elections-voting/other-ways-to-vote/",
  "polling": "https://pollfinder.sos.state.mn.us/",
  "id": "https://www.sos.mn.gov/elections-voting/election-day-voting/do-i-need-to-bring-id/"
 },
 {
  "name": "Mississippi",
  "abbr": "MS",
  "mail": "excuse",
  "status": "https://www.msegov.com/sos/voter_registration/AmIRegistered",
  "register": "https://www.sos.ms.gov/elections-voting/voter-registration-information",
  "absentee": "https://www.sos.ms.gov/yall-vote/absentee-voting-information",
  "polling": "https://myelectionday.sos.state.ms.us/VoterOutreach/Pages/VOSearch.aspx",
  "id": "https://msvoterid.ms.gov/"
 },
 {
  "name": "Missouri",
  "abbr": "MO",
  "mail": "excuse",
  "status": "https://s1.sos.mo.gov/elections/voterlookup/",
  "register": "https://www.sos.mo.gov/elections/goVoteMissouri/register",
  "absentee": "https://www.sos.mo.gov/elections/govotemissouri/howtovote#Absentee",
  "polling": "https://www.sos.mo.gov/elections/pollingplacelookup/",
  "id": "https://s1.sos.mo.gov/elections/goVoteMissouri/howtovote#forms"
 },
 {
  "name": "Montana",
  "abbr": "MT",
  "mail": "no_excuse",
  "status": "https://app.mt.gov/voterinfo/",
  "register": "https://votemt.gov/",
  "absentee": "https://sos.mt.gov/elections/absentee",
  "polling": "https://app.mt.gov/voterinfo/",
  "id": "https://sosmt.gov/elections/faq/#identification"
 },
 {
  "name": "Nebraska",
  "abbr": "NE",
  "mail": "no_excuse",
  "status": "https://www.votercheck.necvr.ne.gov/VoterView/",
  "register": "https://sos.nebraska.gov/elections/registering-vote",
  "absentee": "https://sos.nebraska.gov/elections/early-voting",
  "polling": "https://www.votercheck.necvr.ne.gov/",
  "id": "https://sos.nebraska.gov/elections/election-day-faq"
 },
 {
  "name": "Nevada",
  "abbr": "NV",
  "mail": "all_mail",
  "status": "https://www.nvsos.gov/votersearch/",
  "register": "https://www.nvsos.gov/SOSVoterServices/start.aspx",
  "absentee": "https://www.nvsos.gov/sos/elections/voters/voters-with-disabilities/absentee-voting",
  "polling": "https://nvsos.gov/votersearch/",
  "id": "https://www.nvsos.gov/sos/sos-information/office-facts/faqs-all-division/elections#472"
 },
 {
  "name": "New Hampshire",
  "abbr": "NH",
  "mail": "excuse",
  "status": "https://app.sos.nh.gov/voterinformation",
  "register": "https://www.sos.nh.gov/elections/voters/register-vote",
  "absentee": "https://sos.nh.gov/elections/voters/absentee-ballots/",
  "polling": "https://app.sos.nh.gov/viphome",
  "id": "https://www.sos.nh.gov/sites/g/files/ehbemt561/files/inline-documents/sonh/registering-to-vote-in-new-hampshire-february-2025_3.pdf"
 },
 {
  "name": "New Jersey",
  "abbr": "NJ",
  "mail": "no_excuse",
  "status": "https://voter.svrs.nj.gov/registration-check",
  "register": "https://nj.gov/state/elections/voter-registration.shtml",
  "absentee": "https://www.state.nj.us/state/elections/vote-by-mail.shtml",
  "polling": "https://www.state.nj.us/state/elections/vote-polling-location.shtml",
  "id": "https://www.state.nj.us/state/elections/vote-faq.shtml"
 },
 {
  "name": "New Mexico",
  "abbr": "NM",
  "mail": "no_excuse",
  "status": "https://voterportal.servis.sos.state.nm.us/WhereToVote.aspx",
  "register": "https://www.sos.nm.gov/voting-and-elections/voter-information-portal/voter-registration-information/",
  "absentee": "https://www.sos.nm.gov/voting-and-elections/voter-information-portal/absentee-and-early-voting/",
  "polling": "https://voterportal.servis.sos.state.nm.us/WhereToVote.aspx",
  "id": "https://www.sos.nm.gov/voting-and-elections/voting-faqs/voting/"
 },
 {
  "name": "New York",
  "abbr": "NY",
  "mail": "no_excuse",
  "status": "https://voterlookup.elections.ny.gov/",
  "register": "https://dmv.ny.gov/more-info/electronic-voter-registration-application",
  "absentee": "https://www.elections.ny.gov/VotingAbsentee.html",
  "polling": "https://voterlookup.elections.ny.gov/",
  "id": "https://vote.nyc/page/voter-id"
 },
 {
  "name": "North Carolina",
  "abbr": "NC",
  "mail": "no_excuse",
  "status": "https://vt.ncsbe.gov/RegLkup/",
  "register": "https://www.ncsbe.gov/Voters/Registering-to-Vote",
  "absentee": "https://www.ncsbe.gov/Voting-Options/Absentee-Voting",
  "polling": "https://vt.ncsbe.gov/PPLkup/",
  "id": "https://www.ncsbe.gov/voting/voter-id"
 },
 {
  "name": "North Dakota",
  "abbr": "ND",
  "mail": "no_excuse",
  "status": "https://www.sos.nd.gov/elections",
  "register": "https://www.sos.nd.gov/elections/voter",
  "absentee": "https://vip.sos.nd.gov/absentee/Default.aspx",
  "polling": "https://vip.sos.nd.gov/WhereToVote.aspx?tab=AddressandVotingTimes",
  "id": "https://www.sos.nd.gov/elections/voter/voting-north-dakota"
 },
 {
  "name": "Ohio",
  "abbr": "OH",
  "mail": "no_excuse",
  "status": "https://voterlookup.ohiosos.gov/voterlookup.aspx",
  "register": "https://olvr.ohiosos.gov/",
  "absentee": "https://www.ohiosos.gov/elections/frequently-asked-questions#absentee-voting",
  "polling": "https://www.ohiosos.gov/directories/find-my-polling-location",
  "id": "https://www.ohiosos.gov/elections/voter-ID-requirements"
 },
 {
  "name": "Oklahoma",
  "abbr": "OK",
  "mail": "no_excuse",
  "status": "https://okvoterportal.okelections.us/",
  "register": "https://oklahoma.gov/elections/voter-registration/register-to-vote.html",
  "absentee": "https://oklahoma.gov/elections/voters/absentee-voting.html",
  "polling": "https://okvoterportal.okelections.us/",
  "id": "https://oklahoma.gov/elections/voters/proof-of-identity.html"
 },
 {
  "name": "Oregon",
  "abbr": "OR",
  "mail": "all_mail",
  "status": "https://secure.sos.state.or.us/orestar/vr/showVoterSearch.do?lang=eng",
  "register": "https://sos.oregon.gov/elections/pages/registration.aspx?lang=en",
  "absentee": "https://sos.oregon.gov/elections/pages/voteinor.aspx",
  "polling": "https://sos.oregon.gov/voting/pages/drop-box-locator.aspx",
  "id": "https://sos.oregon.gov/elections/Pages/faq.aspx"
 },
 {
  "name": "Pennsylvania",
  "abbr": "PA",
  "mail": "no_excuse",
  "status": "https://www.vote.pa.gov/Register-to-Vote/Pages/Check-Your-Voter-Registration-Status.aspx",
  "register": "https://www.vote.pa.gov/Register-to-Vote/Pages/How-to-Register-to-Vote.aspx",
  "absentee": "https://www.vote.pa.gov/Voting-in-PA/Pages/Mail-and-Absentee-Ballot.aspx",
  "polling": "https://www.pavoterservices.pa.gov/Pages/PollingPlaceInfo.aspx",
  "id": "https://www.vote.pa.gov/Register-to-Vote/Pages/Voter-ID-for-First-Time-Voters.aspx"
 },
 {
  "name": "Rhode Island",
  "abbr": "RI",
  "mail": "no_excuse",
  "status": "https://vote.sos.ri.gov/Home/UpdateVoterRecord?ActiveFlag=0",
  "register": "https://vote.sos.ri.gov/Home/RegistertoVote?ActiveFlag=1",
  "absentee": "https://vote.sos.ri.gov/Voter/VotebyMail?ActiveFlag=4",
  "polling": "https://vote.sos.ri.gov/Home/PollingPlaces?ActiveFlag=2",
  "id": "https://vote.sos.ri.gov/Content/Pdfs/voter_id_information.pdf"
 },
 {
  "name": "South Carolina",
  "abbr": "SC",
  "mail": "excuse",
  "status": "https://vrems.scvotes.sc.gov/Voter/Login?PageMode=VoterInformation",
  "register": "https://scvotes.gov/voters/register-to-vote/",
  "absentee": "https://scvotes.gov/voters/absentee-voting/",
  "polling": "https://vrems.scvotes.sc.gov/Voter/Login?PageMode=PollingPlace",
  "id": "https://scvotes.gov/voters/photo-id-requirements/"
 },
 {
  "name": "South Dakota",
  "abbr": "SD",
  "mail": "no_excuse",
  "status": "https://vip.sdsos.gov/viplogin.aspx",
  "register": "https://sdsos.gov/elections-voting/voting/register-to-vote/default.aspx",
  "absentee": "https://sdsos.gov/elections-voting/voting/absentee-voting.aspx",
  "polling": "https://vip.sdsos.gov/VIPLogin.aspx",
  "id": "https://sdsos.gov/elections-voting/voting/default.aspx"
 },
 {
  "name": "Tennessee",
  "abbr": "TN",
  "mail": "excuse",
  "status": "https://tnmap.tn.gov/voterlookup/",
  "register": "https://sos.tn.gov/products/elections/how-do-i-register-vote",
  "absentee": "https://sos.tn.gov/products/elections/absentee-voting",
  "polling": "https://tnmap.tn.gov/voterlookup/",
  "id": "https://sos.tn.gov/products/elections/what-id-required-when-voting"
 },
 {
  "name": "Texas",
  "abbr": "TX",
  "mail": "excuse",
  "status": "https://teamrv-mvp.sos.texas.gov/MVP/mvp.do",
  "register": "https://www.votetexas.gov/register-to-vote/index.html",
  "absentee": "https://www.votetexas.gov/voting/early-voting.html",
  "polling": "https://teamrv-mvp.sos.texas.gov/MVP/mvp.do",
  "id": "https://www.votetexas.gov/faq/index.html"
 },
 {
  "name": "Utah",
  "abbr": "UT",
  "mail": "all_mail",
  "status": "https://votesearch.utah.gov/voter-search/search/search-by-voter/voter-info",
  "register": "https://secure.utah.gov/voterreg/index.html",
  "absentee": "https://vote.utah.gov/securing-your-mail-ballot/",
  "polling": "https://votesearch.utah.gov/voter-search/search/search-by-address/how-and-where-can-i-vote",
  "id": "https://secure.utah.gov/voterreg/index.html"
 },
 {
  "name": "Vermont",
  "abbr": "VT",
  "mail": "all_mail",
  "status": "https://mvp.vermont.gov",
  "register": "https://sos.vermont.gov/elections/voters/registration/",
  "absentee": "https://sos.vermont.gov/elections/voters/early-absentee-voting/",
  "polling": "https://mvp.vermont.gov",
  "id": "https://sos.vermont.gov/elections/voters/registration/"
 },
 {
  "name": "Virginia",
  "abbr": "VA",
  "mail": "no_excuse",
  "status": "https://vote.elections.virginia.gov/VoterInformation/Lookup/status",
  "register": "https://www.elections.virginia.gov/registration/how-to-register/",
  "absentee": "https://www.elections.virginia.gov/casting-a-ballot/absentee-voting/",
  "polling": "https://vote.elections.virginia.gov/VoterInformation/Lookup/polling",
  "id": "https://www.elections.virginia.gov/registration/voterid/"
 },
 {
  "name": "Washington",
  "abbr": "WA",
  "mail": "all_mail",
  "status": "https://voter.votewa.gov/WhereToVote.aspx",
  "register": "https://www.sos.wa.gov/elections/voters/voter-eligibility-resources/voter-eligibility",
  "absentee": "https://www.sos.wa.gov/elections/faq_vote_by_mail.aspx",
  "polling": "https://voter.votewa.gov/WhereToVote.aspx",
  "id": "https://www.sos.wa.gov/elections/voters/helpful-information/frequently-asked-questions-about-elections"
 },
 {
  "name": "West Virginia",
  "abbr": "WV",
  "mail": "excuse",
  "status": "https://apps.sos.wv.gov/Elections/Voter/AmIRegisteredToVote",
  "register": "https://ovr.sos.wv.gov/Register/Landing",
  "absentee": "https://sos.wv.gov/absentee-voting-information",
  "polling": "https://apps.sos.wv.gov/elections/voter/index.aspx",
  "id": "https://sos.wv.gov/be-registered-and-ready"
 },
 {
  "name": "Wisconsin",
  "abbr": "WI",
  "mail": "no_excuse",
  "status": "https://myvote.wi.gov/en-us/MyVoterInfo",
  "register": "https://myvote.wi.gov/en-us/RegisterToVote",
  "absentee": "https://elections.wi.gov/node/1103",
  "polling": "https://myvote.wi.gov/en-us/FindMyPollingPlace",
  "id": "https://elections.wi.gov/voters/photo-id"
 },
 {
  "name": "Wyoming",
  "abbr": "WY",
  "mail": "no_excuse",
  "status": "https://sos.wyo.gov/Elections/State/RegisteringToVote.aspx",
  "register": "https://sos.wyo.gov/Elections/State/RegisteringToVote.aspx",
  "absentee": "https://soswy.state.wy.us/Elections/AbsenteeVoting.aspx",
  "polling": "https://soswy.state.wy.us/Elections/PollPlace/Default.aspx",
  "id": "https://soswy.state.wy.us/faqs.aspx?root=ELEC"
 }
];
