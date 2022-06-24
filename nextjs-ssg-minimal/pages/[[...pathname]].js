import { EditablePage } from '@magnolia/react-editor';
import Navigation from '../templates/components/Navigation';
import Basic from '../templates/pages/Basic';
import Contact from '../templates/pages/Contact';
import Headline from '../templates/components/Headline';
import Image from '../templates/components/Image';
import Paragraph from '../templates/components/Paragraph';
import Expander from '../templates/components/Expander';
import List from '../templates/components/List';
import Item from '../templates/components/Item';
import { languages, getCurrentLanguage, setURLSearchParams } from '../utils';

const nodeName = '/nextjs-ssg-minimal';
const config = {
  componentMappings: {
    'nextjs-ssg-minimal-lm:pages/basic': Basic,
    'nextjs-ssg-minimal-lm:pages/contact': Contact,

    'spa-lm:components/headline': Headline,
    'spa-lm:components/image': Image,
    'spa-lm:components/paragraph': Paragraph,
    'spa-lm:components/expander': Expander,
    'spa-lm:components/list': List,
    'spa-lm:components/listItem': Item,
  },
};

const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
const pagesApi = defaultBaseUrl + '/.rest/delivery/pages/v1';
const templateAnnotationsApi = defaultBaseUrl + '/.rest/template-annotations/v1';
const pagenavApi = defaultBaseUrl + '/.rest/delivery/pagenav/v1';

function getStaticPath(node, paths) {
  let pathname = node['@path'].replace(nodeName, '');

  pathname = pathname.split('/');

  pathname.shift();

  languages.forEach((language, i) => {
    let i18nPathname = JSON.parse(JSON.stringify(pathname));

    if (i !== 0) i18nPathname.unshift(language);

    paths.push({ params: { pathname: i18nPathname } });
  });

  node['@nodes'].forEach((nodeName) => getStaticPath(node[nodeName], paths));
}

export async function getStaticPaths() {
  let paths = [];

  const navRes = await fetch(pagenavApi + nodeName);
  const nav = await navRes.json();

  getStaticPath(nav, paths);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const resolvedUrl = context.preview
    ? context.previewData.query.slug
    : context.params.pathname
    ? '/' + context.params.pathname.join('/')
    : '';
  const currentLanguage = getCurrentLanguage(resolvedUrl);
  const isDefaultLanguage = currentLanguage === languages[0];
  const isPagesApp = context.previewData?.query?.mgnlPreview || null;
  let props = {
    isPagesApp,
    isPagesAppEdit: isPagesApp === 'false',
    basename: isDefaultLanguage ? '' : '/' + currentLanguage,
  };

  global.mgnlInPageEditor = props.isPagesAppEdit;

  // Find out page path in Magnolia
  let pagePath = context.preview
    ? nodeName + resolvedUrl.replace(new RegExp('.*' + nodeName), '')
    : nodeName + resolvedUrl;

  if (!isDefaultLanguage) {
    pagePath = pagePath.replace('/' + currentLanguage, '');
  }

  // Fetching page content
  const pagesRes = await fetch(setURLSearchParams(pagesApi + pagePath, 'lang=' + currentLanguage));
  props.page = await pagesRes.json();

  // Fetching page navigation
  const pagenavRes = await fetch(setURLSearchParams(pagenavApi + nodeName, 'lang=' + currentLanguage));
  props.pagenav = await pagenavRes.json();

  // Fetch template annotations only inside Magnolia WYSIWYG
  if (isPagesApp) {
    const templateAnnotationsRes = await fetch(templateAnnotationsApi + pagePath);

    props.templateAnnotations = await templateAnnotationsRes.json();
  }

  return {
    props,
  };
}

export default function Pathname(props) {
  const { page, templateAnnotations, pagenav, isPagesAppEdit, basename } = props;

  return (
    <div className={isPagesAppEdit ? 'disable-a-pointer-events' : ''}>
      {pagenav && <Navigation content={pagenav} nodeName={nodeName} basename={basename} />}
      {page && <EditablePage content={page} config={config} templateAnnotations={templateAnnotations} />}
    </div>
  );
}
