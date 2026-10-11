# Indicateurs du projet Ticket-CAP

---

## 1. Modules fonctionnels développés → 6 modules de rôle, ~40 pages

Le projet est découpé en **6 espaces fonctionnels** distincts, chacun avec son propre ensemble de pages :

| Module | Pages principales |
|---|---|
| **Admin** | Dashboard, Gestion utilisateurs, Données de référence |
| **Manager** | Dashboard, Projets, Allocations, Tickets, Risques, Congés, Imputations, WRICEF, Évaluations, Certifications, Approbations |
| **Project Manager** | Dashboard, Projets, Tickets, Allocations, Imputations, Validation WRICEF, Évaluations |
| **Dev Coordinator** | Dashboard, Tickets, AI Dispatch, Workload, Imputations |
| **Consultant Technique** | Dashboard, Projets, Tickets, Certifications, Congés, Imputations |
| **Consultant Fonctionnel** | Dashboard, Projets, Tickets, Livrables, Objets doc |

En plus, **6 feature modules** côté frontend (`comments`, `dashboard`, `evaluations`, `imputations`, `projects`, `tickets`) et **21 modules de service** backend.

---

## 2. Entités métier / services OData exposés → 4 services OData, 35 entités

**4 services OData** exposés sur `/odata/v4/` :

| Service | Entités clés |
|---|---|
| **CoreService** | Projects, Users, Tickets, Wricefs, WricefObjects, DocumentationObjects, Deliverables, Attachments, AuditLogs |
| **TicketService** | Tickets (avec actions : approve, reject, start, complete), TicketComments, AI actions |
| **TimeService** | Imputations, ImputationPeriods, TimeLogs, Timesheets, Evaluations |
| **UserService** | Users, Allocations, LeaveRequests, Notifications, Certificates |

**35 entités** définies dans le schéma CDS (`schema.cds`), couvrant l'intégralité du domaine métier.

---

## 3. Rôles / profils utilisateurs gérés → 6 rôles

Définis de manière cohérente dans le schéma CDS, le registre de routes frontend, et l'`xs-security.json` XSUAA :

| Rôle | Description |
|---|---|
| **Admin** | Accès complet — audit, référentiels, gestion des utilisateurs |
| **Manager** | Approbations, évaluations, gestion d'équipe |
| **Project Manager** | Pilotage projet, validation WRICEF, allocations |
| **Dev Coordinator** | Dispatch AI, gestion WRICEFs, charge de travail |
| **Consultant Technique** | Exécution tickets, saisie temps, livrables |
| **Consultant Fonctionnel** | Création tickets, tests fonctionnels, livrables |

Chaque rôle dispose de son propre **scope XSUAA**, **role-template** et **role-collection** pour le déploiement BTP.

---

## 4. KPIs intégrés au tableau de bord → 8 KPIs nommés

Calculés via `features/dashboard/model.ts` et affichés via le composant `KPICard` :

### Dashboard Manager (4 KPIs)

| KPI | Description | Calcul |
|---|---|---|
| **TACE** | Taux d'activité moyen des consultants techniques | Moyenne des % d'allocation actifs par consultant technique |
| **SLA Rate** | % de tickets livrés dans les délais | (Tickets DONE livrés avant due date) / (Tickets DONE avec due date) × 100 |
| **Throughput Rate** | Taux de complétion des tickets actifs | (Tickets DONE) / (Tous tickets hors REJECTED) × 100 |
| **Critical Issues** | Nombre de tickets bloqués ou critiques | COUNT où priority='CRITICAL' OU status='BLOCKED' |

### Dashboard Admin (4 KPIs)

| KPI | Description |
|---|---|
| **Total Users** | Nombre total d'utilisateurs enregistrés |
| **Active Users** | Nombre d'utilisateurs actifs (active = true) |
| **Total Projects** | Nombre total de projets |
| **Total Tickets** | Nombre total de tickets |

Les dashboards des autres rôles (TechDashboard, FuncDashboard, DevCoordinator, ProjectManager) ajoutent des métriques contextuelles supplémentaires (statuts, imputations, workload).

---

## Récapitulatif

| Indicateur | Valeur |
|---|---|
| Modules fonctionnels (espaces de rôle) | **6** |
| Pages / routes totales | **~40** |
| Services OData exposés | **4** |
| Entités métier (schema.cds) | **35** |
| Modules de service backend | **21** |
| Rôles / profils utilisateurs | **6** |
| Scopes XSUAA / Role-collections | **6** |
| KPIs nommés dans les dashboards | **8** |
