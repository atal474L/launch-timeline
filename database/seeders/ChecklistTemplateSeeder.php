<?php

namespace Database\Seeders;

use App\Models\ChecklistTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChecklistTemplateSeeder extends Seeder
{
    private const Template = [
        [
            'phase_id' => 1,
            'question' => 'Manual en/of video CMS-training op dashboard'
        ],
        [
            'phase_id' => 1,
            'question' => 'Pre- en postlaunches team inplannen'
        ],
        [
            'phase_id' => 1,
            'question' => 'Opzet Asana'
        ],
        [
            'phase_id' => 1,
            'question' => 'Novalicentie aankopen'
        ],
        [
            'phase_id' => 2,
            'question' => 'Kijken of alles in orde is met externe providers, hebben we alle API keys, is alles goed ingesteld (mollie, Google Maps, nieuwsbrieven, ..)'
        ],
        [
            'phase_id' => 2,
            'question' => 'DevOps inplannen'
        ],
        [
            'phase_id' => 2,
            'question' => 'Check DNS Intern: Welke domeinnamen zijn er? Redirects? Extern: Contact opnemen met beheerder en moment van switch afspreken. Welke domeinnamen zijn er? Redirects?'
        ],
        [
            'phase_id' => 2,
            'question' => 'Test items & dummy content verwijderen uit CMS (inquiries, admins, etc)'
        ],
        [
            'phase_id' => 2,
            'question' => 'Translations: Forms: errormeldingen & succesmeldingen / E-mails content? / 404 & 410 pagina / tabs/titels /routes'
        ],
        [
            'phase_id' => 2,
            'question' => 'Settings in orde? Geen dummy content meer?'
        ],
        [
            'phase_id' => 2,
            'question' => 'SEO-routes ingevuld?'
        ],
        [
            'phase_id' => 2,
            'question' => 'Indien e-commerce: algemene voorwaarden & cancel policy nodig (content)'
        ],
        [
            'phase_id' => 3,
            'question' => 'CMS-toegang uitzetten voor klant'
        ],
        [
            'phase_id' => 3,
            'question' => 'Start pre-launch checklists & afwerkingen (vb. Tracking, URL mapping, etc) Minimaal 1 week, idealiter 2 weken: Tijdens deze periode
                           kunnen ook de bugs uit testing worden aangepakt, maar idealiter gebeurt dat voor content freeze'
        ],
        [
            'phase_id' => 3,
            'question' => 'DNS records doorsturen naar PM (en klant) als we DNS niet onder controle hebben'
        ],
        [
            'phase_id' => 3,
            'question' => 'Design check'
        ],
        [
            'phase_id' => 3,
            'question' => 'Stoppen met toevoegen nieuwe zaken/requests'
        ],
        [
            'phase_id' => 3,
            'question' => 'DNS TTL aanpassen naar 300 sec. (zodat we op launch dag geen uren moeten wachten tot DNS doorkomt)'
        ],
        [
            'phase_id' => 3,
            'question' => 'Master omgeving opzetten (zodat op launchdag enkel DNS aangepast moet worden)'
        ],
        [
            'phase_id' => 3,
            'question' => 'Doorgeven tijdens PM meeting dat er case mag komen'
        ],
        [
            'phase_id' => 3,
            'question' => 'Cross-team code reviews'
        ],
        [
            'phase_id' => 4,
            'question' => 'Post launches'
        ],
        [
            'phase_id' => 5,
            'question' => 'meeting en/of Google form'
        ],
        [
            'phase_id' => 5,
            'question' => 'Nacalculatie / budgetopvolging'
        ],
        [
            'phase_id' => 5,
            'question' => 'Al deze debriefingsdocumenten: documenteren in confluence'
        ],
        [
            'phase_id' => 5,
            'question' => 'Bij grote / complexe / interessante projecten: presentatie van het project voor volledige Code d’Or team - moet niet persé PM zijn'
        ],
        [
            'phase_id' => 5,
            'question' => 'Teammeeting'
        ],
        [
            'phase_id' => 5,
            'question' => 'Learnings doorgeven op volgende PM-meeting'
        ],
        [
            'phase_id' => 5,
            'question' => 'Tijdsinschattingen vergelijken met gepresteerde tijd'
        ],
        [
            'phase_id' => 5,
            'question' => 'Mail klant roadmapping meeting / next steps (aanwezigheid AM en/of Frank?)'
        ],
        [
            'phase_id' => 5,
            'question' => 'Tickets Jira opkuisen'
        ],
        [
            'phase_id' => 5,
            'question' => 'Portfolio.codedor.be aanvullen met nieuw project'
        ],
        [
            'phase_id' => 5,
            'question' => 'Is de case-flow opgestart geweest rond CMS-training periode? '
        ],
    ];

    public function run()
    {
        foreach (self::Template as $question) {
            ChecklistTemplate::create([
                'phase_id' => $question['phase_id'],
                'question' => $question['question'],
            ]);
        }
    }
}
