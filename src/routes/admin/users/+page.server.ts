import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends, url }) => {
    depends('app:session');

    if (!locals.session || !locals.user) {
        return redirect(303, '/login');
    }
    if (locals.user.role !== 'admin') {
        return error(403, 'You do not have permission to access this page.');
    }

    const pageParam = Number(url.searchParams.get('page') ?? '1');
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const search = url.searchParams.get('search')?.trim() ?? '';

    return {
        page,
        search
    };
};
